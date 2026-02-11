$baseUrl = "http://localhost/hospital-backend/api"
$email = "doctor@mediqueue.com"
$password = "doctor123"

# Login
Write-Host "Logging in..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body (@{email=$email;password=$password}|ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Login Success. Token: $token"
} catch {
    Write-Error "Login Failed: $($_.Exception.Message)"
    exit 1
}

$headers = @{Authorization="Bearer $token"}

# Test doctor.php directly
Write-Host "`nTesting GET appointments/doctor.php..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/appointments/doctor.php" -Method Get -Headers $headers
    Write-Host "Success!"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Error "Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
         $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
         Write-Host "Body: $($reader.ReadToEnd())"
    }
}
