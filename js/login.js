<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تسجيل الدخول</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      background:#0d1b2a;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      font-family: Arial;
      margin:0;
    }
    .card {
      background:#1b2a41;
      padding:25px;
      border-radius:12px;
      width:300px;
      box-shadow:0 10px 30px rgba(0,0,0,.3);
    }
    h2 {
      color:#fff;
      text-align:center;
      margin-bottom:20px;
    }
    input {
      width:100%;
      padding:12px;
      margin-bottom:12px;
      border-radius:8px;
      border:none;
      font-size:14px;
    }
    button {
      width:100%;
      padding:12px;
      background:#3a6df0;
      color:#fff;
      border:none;
      border-radius:8px;
      font-size:16px;
      cursor:pointer;
    }
    button:active {
      transform: scale(.98);
    }
  </style>
</head>

<body>

  <div class="card">
    <h2>تسجيل الدخول</h2>

    <input type="email" id="email" placeholder="الإيميل">
    <input type="password" id="password" placeholder="كلمة المرور">

    <!-- الربط هنا -->
    <button onclick="login()">دخول</button>
  </div>

  <!-- لازم يكونوا Module -->
  <script type="module" src="js/firebase.js"></script>
  <script type="module" src="js/auth.js"></script>

</body>
</html>
