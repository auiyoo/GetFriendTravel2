$port = 5500
$root = "$PSScriptRoot\public"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "IT Dashboard → http://localhost:$port"

$mimes = @{
  '.html'='text/html; charset=utf-8'
  '.css' ='text/css; charset=utf-8'
  '.js'  ='application/javascript; charset=utf-8'
  '.json'='application/json'
  '.png' ='image/png'
  '.svg' ='image/svg+xml'
  '.ico' ='image/x-icon'
}

while ($listener.IsListening) {
  try {
    $ctx  = $listener.GetContext()
    $req  = $ctx.Request
    $res  = $ctx.Response
    $path = $req.Url.LocalPath
    if ($path -eq '/' -or $path -eq '') { $path = '/index.html' }
    $filePath = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))

    if (Test-Path $filePath -PathType Leaf) {
      $ext  = [IO.Path]::GetExtension($filePath).ToLower()
      $mime = if ($mimes[$ext]) { $mimes[$ext] } else { 'application/octet-stream' }
      $bytes = [IO.File]::ReadAllBytes($filePath)
      $res.StatusCode   = 200
      $res.ContentType  = $mime
      $res.SendChunked  = $false
      $res.ContentLength64 = $bytes.LongLength
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $b = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $res.ContentLength64 = $b.LongLength
      $res.OutputStream.Write($b, 0, $b.Length)
    }
  } catch {
    Write-Warning "Request error: $_"
  } finally {
    try { $res.OutputStream.Flush(); $res.OutputStream.Close() } catch {}
  }
}
