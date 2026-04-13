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
        $env = parse_ini_file(__DIR__ . '/../.env');
        $this->host = $env['DB_HOST'];
        $this->db_name = $env['DB_NAME'];
        $this->username = $env['DB_USER'];
        $this->password = $env['DB_PASS'];
        // Default to Aiven MySQL common port 25060 if DB_PORT is not in .env, otherwise use 3306 or DB_PORT
        $this->port = isset($env['DB_PORT']) ? $env['DB_PORT'] : '25060'; 
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
?>
