$headers = @{ "Content-Type" = "application/json" }
$body = @{ email = "patient@mediqueue.com"; password = "patient123" } | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost/hospital-backend/api/auth/login.php" -Method Post -Headers $headers -Body $body
    Write-Host "LOGIN SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "LOGIN FAILED!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: " $reader.ReadToEnd()
    }
}
