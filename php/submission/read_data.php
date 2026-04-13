<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Embed PHP code from another file
include_once '../config/database.php';
// Initialise
$database = new Database();
$db = $database->getConnection();

try {
    // Display the latest
    $query = "SELECT * FROM job_submission ORDER BY id DESC";

    // Prepare() is a more secure method
    $stmt = $db->prepare($query);
    $stmt->execute();

    $jobs = [];

    // Store fetched data into $row, 'FETCH_ASSOC' assign key with value: "name" => "John"
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Parse the JSON string to an array
        $personnel_array = [];

        if (!empty($row['team_personnel'])) {

            // 'true' decodes as an associative array
            $parsed = json_decode($row['team_personnel'], true);
            
            if (is_array($parsed)) {
                $personnel_array = $parsed;
            }
        }

        $job = [
            "id" => (string)$row['id'],
            "jobNumber" => $row['job_number'],
            "jobType" => $row['job_type'],
            "siteLocation" => $row['site_location'],
            "completionDate" => $row['completion_date'],
            "completionTime" => $row['completion_time'],
            "contractorCompany" => isset($row['contractor_company']) ? $row['contractor_company'] : '',
            "notes" => isset($row['job_notes']) ? $row['job_notes'] : '',
            "personnelNames" => $personnel_array,
            "huaweiSyncStatus" => isset($row['sync_status']) ? $row['sync_status'] : "pending",
            "teamPhotoUrl" => "/php/submission/read_images.php?id=" . $row['id'],
            "createdAt" => isset($row['created_at']) ? $row['created_at'] : $row['completion_date'],
        ];
        
        // Append in array
        array_push($jobs, $job);
    }

    http_response_code(200);
    echo json_encode(["success" => true, "jobs" => $jobs]);
} 
catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "SQL Error: " . $e->getMessage()]);
}
?>
