Write-Host "Forcing overwrite of login.php..."
$source = "d:\hospital\backend\api\auth\login.php"
$dest = "C:\xampp\htdocs\hospital-backend\api\auth\login.php"

if (Test-Path $dest) {
    Write-Host "Deleting old file..."
    Remove-Item -Path $dest -Force
}

Write-Host "Copying new file..."
Copy-Item -Path $source -Destination $dest -Force

Write-Host "Verifying new file size..."
$size = (Get-Item $dest).Length
Write-Host "Size: $size bytes"

Write-Host "Done."
