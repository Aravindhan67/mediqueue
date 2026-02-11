# Test Debug Doctor
$baseUrl = "http://localhost/hospital-backend/api"
$email = "doctor@mediqueue.com"
$password = "doctor123"

# Login to get token
$login = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body (@{email=$email; password=$password} | ConvertTo-Json) -ContentType "application/json"
$token = $login.data.token
$headers = @{Authorization="Bearer $token"}

# Call Debug Endpoint
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/debug_doctor.php" -Method Get -Headers $headers
    Write-Host "Debug Result:"
    $result | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
