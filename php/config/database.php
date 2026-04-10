<?php

class Database {
    // Database credentials
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $charset = 'utf8mb4';
    public $conn;

    public function __construct() {
        $env = parse_ini_file(__DIR__ . '/../.env');
        $this->host = $env['DB_HOST'];
        $this->db_name = $env['DB_NAME'];
        $this->username = $env['DB_USER'];
        $this->password = $env['DB_PASS'];
    }

    public function getConnection() {
        $this->conn = null;

        try {
            // Data Source Name
            $dsn = "mysql:host=$this->host;dbname=$this->db_name;charset=$this->charset";

            // Error handling & performance
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch associative arrays
                PDO::ATTR_EMULATE_PREPARES => false, // Use native prepared statements
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
