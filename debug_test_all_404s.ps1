$baseUrl = "http://localhost/hospital-backend/api"
$doctorEmail = "doctor@mediqueue.com"
$doctorPass = "doctor123"
$patientEmail = "patient@mediqueue.com"
$patientPass = "patient123"

function Get-Token($email, $password) {
    try {
        $res = Invoke-RestMethod -Uri "$global:baseUrl/auth/login.php" -Method Post -Body (@{email=$email;password=$password}|ConvertTo-Json) -ContentType "application/json"
        return $res.data.token
    } catch {
        Write-Host "Login failed for $email : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

$docToken = Get-Token $doctorEmail $doctorPass
$patToken = Get-Token $patientEmail $patientPass

Write-Host "`n--- Testing Doctor Endpoints ---"
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/appointments/doctor.php" -Method Get -Headers @{Authorization="Bearer $docToken"}
    Write-Host "GET appointments/doctor.php: OK" -ForegroundColor Green
} catch {
    Write-Host "GET appointments/doctor.php: FAILED $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Testing Patient Endpoints ---"
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/appointments/patient.php" -Method Get -Headers @{Authorization="Bearer $patToken"}
    Write-Host "GET appointments/patient.php: OK" -ForegroundColor Green
} catch {
    Write-Host "GET appointments/patient.php: FAILED $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Testing Booking Endpoint (Simulated) ---"
try {
    $body = @{doctor_id=1; date="2026-02-12"; time="10:00:00"} | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/appointments/book.php" -Method Post -Headers @{Authorization="Bearer $patToken"} -Body $body -ContentType "application/json"
    Write-Host "POST appointments/book.php: OK (Success or Logic Error)" -ForegroundColor Green
} catch {
    $code = $_.Exception.Response.StatusCode
    if ($code -eq 400 -or $code -eq 409 -or $code -eq 404) {
         Write-Host "POST appointments/book.php: OK (Logic Error $code handled correctly)" -ForegroundColor Green
    } else {
         Write-Host "POST appointments/book.php: FAILED $($_.Exception.Message)" -ForegroundColor Red
    }
}
