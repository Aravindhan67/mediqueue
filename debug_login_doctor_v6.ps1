try {
    $r = Invoke-WebRequest -Uri 'http://localhost/hospital-backend/api/auth/login.php' -Method Post -Body (@{email='doctor@mediqueue.com';password='doctor123'}|ConvertTo-Json) -ContentType 'application/json' -UseBasicParsing
    Write-Output "SUCCESS: $($r.Content)"
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $s = $_.Exception.Response.GetResponseStream()
        $r = New-Object System.IO.StreamReader($s)
        Write-Output "BODY: $($r.ReadToEnd())"
    }
}
