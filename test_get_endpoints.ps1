$baseUrl = "http://localhost/hospital-backend/api"
$email = "patient@mediqueue.com"
$password = "patient123"

# 1. Login to get token
Write-Host "1. Logging in..."
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login Success. Token received."
} catch {
    Write-Error "Login Failed: $($_.Exception.Message)"
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
}

# List of GET endpoints to test
$endpoints = @(
    "/doctors/list.php",
    "/doctors/details.php?id=1",
    "/schedules/doctor.php?doctor_id=1",
    "/appointments/patient.php",
    "/appointments/doctor.php",
    "/prescriptions/list.php"
)

foreach ($ep in $endpoints) {
    Write-Host "`nTesting GET $ep ..." -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$ep" -Method Get -Headers $headers
        if ($response.success -eq $true -or $response.success -eq "true") {
             Write-Host " [OK]" -ForegroundColor Green
        } else {
             Write-Host " [FAILED (Logic)]" -ForegroundColor Red
             Write-Host $response
        }
    } catch {
        Write-Host " [FAILED (HTTP)]" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        
        if ($_.Exception.Response) {
             $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
             Write-Host "Body: $($reader.ReadToEnd())"
        }
    }
}
