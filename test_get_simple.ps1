$baseUrl = "http://localhost/hospital-backend/api"
$email = "doctor@mediqueue.com"
$password = "doctor123"

# Login
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body (@{email=$email;password=$password}|ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Response: $($loginResponse | ConvertTo-Json -Depth 5)"
    Write-Host "Token: $token"
    $headers = @{Authorization="Bearer $token"}

Write-Host "Testing doctors/list.php..." -NoNewline
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/doctors/list.php" -Method Get -Headers $headers
    if ($res.success) { Write-Host "OK" -ForegroundColor Green } else { Write-Host "FAIL" -ForegroundColor Red }
} catch { Write-Host "HTTP ERROR" -ForegroundColor Red; Write-Host $_.Exception.Message }

Write-Host "Testing prescriptions/list.php..." -NoNewline
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/prescriptions/list.php" -Method Get -Headers $headers
    if ($res.success) { Write-Host "OK" -ForegroundColor Green } else { Write-Host "FAIL" -ForegroundColor Red }
} catch { Write-Host "HTTP ERROR" -ForegroundColor Red; Write-Host $_.Exception.Message }
