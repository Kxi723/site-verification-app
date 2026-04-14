<?php

class Database {
    // Database credentials
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    private $charset = 'utf8mb4';
    public $conn;

    public function __construct() {
        // ✅ Railway 用系统环境变量，不是 .env 文件
        // 本地开发时先 fallback 到 .env
        $env = [];
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $env = parse_ini_file($envFile);
        }

        // getenv() 优先读 Railway 注入的环境变量，找不到才用 .env
        $this->host     = getenv('DB_HOST')     ?: ($env['DB_HOST']     ?? '');
        $this->db_name  = getenv('DB_NAME')     ?: ($env['DB_NAME']     ?? '');
        $this->username = getenv('DB_USER')     ?: ($env['DB_USER']     ?? '');
        $this->password = getenv('DB_PASS')     ?: ($env['DB_PASS']     ?? '');
        $this->port     = getenv('DB_PORT')     ?: ($env['DB_PORT']     ?? '25060');
    }

    public function getConnection() {
        $this->conn = null;

        try {
            // Data Source Name with Port
            $dsn = "mysql:host=$this->host;port=$this->port;dbname=$this->db_name;charset=$this->charset";

            // Error handling & performance & cloud configurations
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch associative arrays
                PDO::ATTR_EMULATE_PREPARES => false, // Use native prepared statements
                PDO::ATTR_PERSISTENT => true, // Helpful for cloud DB latency
                
                // === Aiven / Cloud DB SSL Requirement ===
                PDO::MYSQL_ATTR_SSL_CA => __DIR__ . '/ca.pem',
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } 
        catch(PDOException $exception) {
            echo json_encode([
                "success" => false, 
                "message" => "Database connection failed: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
