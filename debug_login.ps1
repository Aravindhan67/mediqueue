try {
    $response = Invoke-RestMethod -Uri "http://localhost/hospital-backend/api/auth/login.php" -Method Post -Body (@{email='patient@mediqueue.com';password='patient123'} | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Success!"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Body: $body"
    }
}
