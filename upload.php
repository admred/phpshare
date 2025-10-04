<?php
    session_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    $csrf_token = $_SESSION['csrf_token'];
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="csrf-token" content="<?= $csrf_token ?>"/>
    <link rel="stylesheet" href="/css/common.css"/>
    <link rel="stylesheet" href="/css/skeleton.css"/>
    <link rel="stylesheet" href="/css/styles.css"/>
    <title>Upload a File</title>
</head>
<body>
    <header>
        <div id="message-1" class="message"></div>
    </header>
    <nav class="container">
        <a class="button button-primary" href="/upload.html">
            Upload
        </a>
        <a class="button" href="/list.html">
            Files
        </a>
        <a class="button" href="/search.html">
            Search
        </a>
    </nav>
    <main class="container"">
        
        <section>
            <label for="upload-action" class="custom-file">Upload files</label>
            <input type="file" id="upload-action" multiple>
        </section>
        <section>
            <table id="entries">
                <thead>
                    <tr>
                        <th>Files</th>
                    </tr>
                </thead>
                <tbody id="entries-content"></tbody>
            </table>
        </section>
    </main>
    <script src="/js/actions.js"></script>
</body>
</html>
