<?php

namespace App;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class QueueServer implements MessageComponentInterface
{
    protected $clients;
    protected $db;
    protected $lastQueueData = [];
    protected $broadcastInterval = 3; // Broadcast every 3 seconds
    protected $lastBroadcastTime = 0;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        echo "[" . date('Y-m-d H:i:s') . "] WebSocket Server Started on ws://0.0.0.0:8080\n";

        // Initialize database connection
        $this->initDatabase();

        // Set up periodic timer for broadcasting
        $this->setupPeriodicBroadcast();
    }

    private function initDatabase()
    {
        try {
            $this->db = new \PDO(
                'mysql:host=localhost;dbname=react1.0;charset=utf8mb4',
                'rhu_user',
                'rhu_pass123'
            );
            $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            echo "[" . date('Y-m-d H:i:s') . "] Database connected\n";
        } catch (\Exception $e) {
            echo "[ERROR] Database connection failed: " . $e->getMessage() . "\n";
            $this->db = null;
        }
    }

    private function setupPeriodicBroadcast()
    {
        // Use a busy-wait approach in the onMessage handler
        // Since Ratchet doesn't have built-in timers, we'll call broadcast on client activities
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "[" . date('Y-m-d H:i:s') . "] New connection! ({$this->clients->count()} total)\n";

        // Send welcome message
        $conn->send(json_encode([
            'type' => 'connected',
            'message' => 'Connected to Queue Server',
            'timestamp' => date('Y-m-d H:i:s')
        ]));

        // Send initial queue data (waiting patients)
        $this->broadcastQueueData();

        // Send initial doctor queue data (all doctor assignments for today)
        $this->broadcastDoctorQueue(null);
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);

        if ($data === null) {
            echo "[" . date('Y-m-d H:i:s') . "] ❌ Failed to decode JSON message\n";
            return;
        }

        echo "[" . date('Y-m-d H:i:s') . "] 📨 Received message type: " . ($data['type'] ?? 'unknown') . "\n";

        // Handle waiting queue refresh triggers
        if (
            $data['type'] === 'refresh-queue-now' ||
            $data['type'] === 'queue-updated' ||
            $data['type'] === 'request-refresh'
        ) {
            echo "[" . date('Y-m-d H:i:s') . "] 🔄 Live fetch trigger (waiting queue) from client\n";
            $this->broadcastQueueData();
        }

        // Handle doctor queue refresh triggers
        if (
            $data['type'] === 'refresh-doctor-queue-now' ||
            $data['type'] === 'doctor-assignment-updated'
        ) {
            echo "[" . date('Y-m-d H:i:s') . "] 🔄 Live fetch trigger (doctor queue) from client\n";
            // ✅ Always broadcast ALL doctor assignments (unfiltered)
            // Each client will filter by their own logged-in doctor ID
            $this->broadcastDoctorQueue(null);
        }

        // Handle encoder queue refresh triggers
        if (
            $data['type'] === 'refresh-encoder-queue-now' ||
            $data['type'] === 'consultation-saved' ||
            $data['type'] === 'encoder-queue-updated'
        ) {
            echo "[" . date('Y-m-d H:i:s') . "] 🔄 Live fetch trigger (encoder queue) from client\n";
            $this->broadcastEncoderQueue();
        }
    }

    private function broadcastQueueData()
    {
        if (!$this->db) {
            echo "[ERROR] Database connection not available\n";
            return;
        }

        try {
            // 🔄 Fetch waiting queue with patient information (same as API)
            $sql = "
                SELECT 
                    q.id,
                    q.queue_code,
                    q.queue_type,
                    q.queue_number,
                    q.status,
                    q.created_at,
                    p.first_name,
                    p.last_name
                FROM patient_queue q
                JOIN patients_db p ON p.id = q.patient_id
                WHERE q.queue_date = CURDATE()
                  AND q.status = 'waiting'
                ORDER BY 
                    FIELD(q.queue_type, 'PRIORITY', 'REGULAR'),
                    q.queue_number ASC
            ";

            $stmt = $this->db->query($sql);
            $waitingQueue = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            echo "[" . date('Y-m-d H:i:s') . "] 🔍 Broadcast query executed\n";
            echo "[" . date('Y-m-d H:i:s') . "] 📊 Found " . count($waitingQueue) . " patients with status='waiting'\n";

            // Log details of each patient
            foreach ($waitingQueue as $idx => $patient) {
                echo "[" . date('Y-m-d H:i:s') . "]   - Patient {$idx}: ID={$patient['id']}, Code={$patient['queue_code']}, Status={$patient['status']}\n";
            }

            // ✅ Broadcast to all connected clients
            if (count($this->clients) > 0) {
                $response = [
                    'type' => 'waiting-queue',
                    'data' => $waitingQueue,
                    'timestamp' => date('Y-m-d H:i:s'),
                    'count' => count($waitingQueue)
                ];

                $sentCount = 0;
                foreach ($this->clients as $client) {
                    try {
                        $client->send(json_encode($response));
                        $sentCount++;
                    } catch (\Exception $e) {
                        echo "[ERROR] Failed to send to client: " . $e->getMessage() . "\n";
                    }
                }

                echo "[" . date('Y-m-d H:i:s') . "] ✅ Live broadcast to {$sentCount} clients: " . count($waitingQueue) . " patients waiting\n";
            } else {
                echo "[" . date('Y-m-d H:i:s') . "] No clients connected\n";
            }
        } catch (\Exception $e) {
            echo "[ERROR] Failed to fetch/broadcast queue data: " . $e->getMessage() . "\n";
            // Try to reconnect to database
            $this->initDatabase();
        }
    }

    private function broadcastEncoderQueue()
    {
        if (!$this->db) {
            echo "[ERROR] Database connection not available\n";
            return;
        }

        try {
            // 🔄 Fetch encoder queue (patients with status='done', grouped by earliest queue_number per patient)
            $sql = "SELECT *
FROM (
    SELECT 
        dpq.id AS queue_id,
        dpq.patient_id,
        dpq.doctor_id,
        dpq.queue_number,
        dpq.queue_date,
        dpq.status,
        dpq.is_active,
        dpq.created_at,
        p.first_name,
        p.last_name,
        u.name AS doctor_name,
        (SELECT COUNT(*) 
         FROM consultations c 
         WHERE c.patient_id = dpq.patient_id 
           AND (
             c.diagnosis IS NOT NULL 
             OR c.treatment IS NOT NULL
           )
        ) AS has_consultation,
        pq.created_at AS visit_date,

        ROW_NUMBER() OVER (
            PARTITION BY dpq.patient_id
            ORDER BY dpq.queue_number ASC
        ) AS rn

    FROM doctor_patient_queue dpq
    JOIN patients_db p ON p.id = dpq.patient_id
    JOIN users u ON u.id = dpq.doctor_id
    LEFT JOIN patient_queue pq ON pq.id = dpq.patient_queue_id

    WHERE dpq.queue_date = CURDATE()
      AND dpq.status = 'done'
) t
WHERE rn = 1
ORDER BY queue_number ASC";

            echo "[" . date('Y-m-d H:i:s') . "] 🔍 Executing encoder queue query\n";
            $stmt = $this->db->query($sql);
            $encoderQueue = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            // Add full patient name
            foreach ($encoderQueue as &$row) {
                $row['patient_name'] = trim($row['first_name'] . ' ' . $row['last_name']);
            }

            echo "[" . date('Y-m-d H:i:s') . "] 📊 Query result: " . count($encoderQueue) . " patients to encode\n";

            // Log details of each patient
            foreach ($encoderQueue as $idx => $patient) {
                $encodedStatus = $patient['has_consultation'] > 0 ? 'Encoded' : 'Pending';
                echo "[" . date('Y-m-d H:i:s') . "]   Patient {$idx}: ID={$patient['queue_id']}, Name={$patient['patient_name']}, Status={$encodedStatus}\n";
            }

            // ✅ Broadcast to all connected clients
            if (count($this->clients) > 0) {
                $response = [
                    'type' => 'encoder-queue',
                    'data' => $encoderQueue,
                    'timestamp' => date('Y-m-d H:i:s'),
                    'count' => count($encoderQueue)
                ];

                $sentCount = 0;
                foreach ($this->clients as $client) {
                    try {
                        $client->send(json_encode($response));
                        $sentCount++;
                    } catch (\Exception $e) {
                        echo "[ERROR] Failed to send to client: " . $e->getMessage() . "\n";
                    }
                }

                echo "[" . date('Y-m-d H:i:s') . "] ✅ Live broadcast to {$sentCount} clients: " . count($encoderQueue) . " patients to encode\n";
            } else {
                echo "[" . date('Y-m-d H:i:s') . "] No clients connected\n";
            }
        } catch (\Exception $e) {
            echo "[ERROR] Failed to fetch/broadcast encoder queue data: " . $e->getMessage() . "\n";
            // Try to reconnect to database
            $this->initDatabase();
        }
    }

    private function broadcastDoctorQueue($doctorId = null)
    {
        if (!$this->db) {
            echo "[ERROR] Database connection not available\n";
            return;
        }

        try {
            // 🔄 Fetch doctor queue assignments with patient information
            $sql = "
                SELECT 
                    dpq.id,
                    dpq.patient_id,
                    dpq.doctor_id,
                    dpq.patient_queue_id,
                    dpq.queue_number,
                    dpq.queue_date,
                    dpq.status,
                    dpq.is_active,
                    dpq.created_at,
                    p.first_name,
                    p.last_name,
                    u.name as doctor_name
                FROM doctor_patient_queue dpq
                JOIN patients_db p ON p.id = dpq.patient_id
                JOIN users u ON u.id = dpq.doctor_id
                WHERE dpq.queue_date = CURDATE()
                  AND dpq.status IN ('waiting', 'serving')
            ";

            // Add doctor filter if specific doctor requested
            if ($doctorId) {
                $sql .= " AND dpq.doctor_id = " . intval($doctorId);
            }

            $sql .= " ORDER BY dpq.status = 'serving' DESC, dpq.queue_number ASC";

            echo "[" . date('Y-m-d H:i:s') . "] 🔍 Executing doctor queue query\n";
            $stmt = $this->db->query($sql);
            $doctorQueue = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            echo "[" . date('Y-m-d H:i:s') . "] 📊 Query result: " . count($doctorQueue) . " doctor assignments\n";

            // Log details of each assignment - INCLUDING patient_queue_id
            foreach ($doctorQueue as $idx => $assignment) {
                echo "[" . date('Y-m-d H:i:s') . "]   Assignment {$idx}: ID={$assignment['id']}, PatientQueueID={$assignment['patient_queue_id']}, DoctorID={$assignment['doctor_id']}, Patient={$assignment['first_name']} {$assignment['last_name']}, Status={$assignment['status']}, IsActive={$assignment['is_active']}\n";
            }

            // ✅ Broadcast to all connected clients
            if (count($this->clients) > 0) {
                $response = [
                    'type' => 'doctor-assignments',
                    'data' => $doctorQueue,
                    'timestamp' => date('Y-m-d H:i:s'),
                    'count' => count($doctorQueue),
                    'doctor_id' => $doctorId
                ];

                $sentCount = 0;
                foreach ($this->clients as $client) {
                    try {
                        $client->send(json_encode($response));
                        $sentCount++;
                    } catch (\Exception $e) {
                        echo "[ERROR] Failed to send to client: " . $e->getMessage() . "\n";
                    }
                }

                $doctorFilter = $doctorId ? " (Doctor ID: {$doctorId})" : "";
                echo "[" . date('Y-m-d H:i:s') . "] ✅ Live broadcast to {$sentCount} clients: " . count($doctorQueue) . " doctor assignments{$doctorFilter}\n";
            } else {
                echo "[" . date('Y-m-d H:i:s') . "] No clients connected\n";
            }
        } catch (\Exception $e) {
            echo "[ERROR] Failed to fetch/broadcast doctor queue data: " . $e->getMessage() . "\n";
            // Try to reconnect to database
            $this->initDatabase();
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "[" . date('Y-m-d H:i:s') . "] Connection closed! ({$this->clients->count()} remaining)\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "[" . date('Y-m-d H:i:s') . "] Error: {$e->getMessage()}\n";
        $conn->close();
    }
}
