<?php
require dirname(__DIR__) . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use App\QueueServer;

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new QueueServer()
        )
    ),
    8080,
    '0.0.0.0'
);

echo "Queue WebSocket Server running on ws://0.0.0.0:8080\n";
echo "Press Ctrl+C to stop\n";

$server->run();
