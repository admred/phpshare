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
    <link rel="stylesheet" href="/css/styles.css"/>
    <title>Upload a File</title>
</head>
<body>

    <nav class="container">
        <a class="button active" href="/upload.html">
            Upload
        </a>
        <a class="button" href="/list.php">
            Files
        </a>
        <a class="button" href="/search.html">
            Search
        </a>
    </nav>
    <header>
        <div id="message-1" class="message"></div>
    </header>
    <main class="container">
        <section>
            <label for="upload-action" class="custom-file button">Upload files</label>
            <input type="file" id="upload-action" multiple>
        </section>
        <section>
            <table class="spinning entry"  id="entries" style="display:block;"></table>    
        </section>
    </main>
    <template id="upload-tmpl">
        <tr class="spinning">
            <td> 
                <button class="cancel-button">Cancel</button>
            </td>
            <td class="filename"></td>
            <td class="progress-text"></td>
        </tr>
    </template>
    <script src="/js/actions.js"></script>
</body>
</html>
