<?php require "files.php"; ?>
<html>
<head>
    <meta charset="UTF-8">
    <title>Upload a File</title>
</head>
<body>   
    <form action="upload.php" method="POST" enctype="multipart/form-data" >
        <fieldset>
            <legend>Upload</legend>
            <input type="file" name="upload[]" multiple="true">
            <input type="submit">
        </fieldset>
    </form>

    <fieldset>
        <legend>Search</legend>
        <form action="index.php" method="GET">
            <input type="search" name="q">
            <input type="submit">
        </form>
    </fieldset>
    <br>
    <table border="1" cellspacing="3" width="100%">
        <tr>
            <th>ctime</th>
            <th>name</th>
            <th>size</th>
            <th>mime</th>
        </tr>
        
        <?php foreach($lista  as $f): ?>
        <tr>
            <td><?php echo $f['ctime'];?></td>
            <td><a href="<?php echo $f['name'];?>" title="<?php echo $f['name'];?>"  target="_blank"><?php echo $f['name'];?></td>
            <td><?php echo $f['size'];?></td>
            <td><?php echo $f['type'];?></td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
