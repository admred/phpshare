<?php

!isset($_FILES['upload'] ) and die();

for($i=0;$i<count($_FILES['upload']['name']);$i++){
    move_uploaded_file($_FILES['upload']['tmp_name'][$i],"./uploads/".$_FILES['upload']['name'][$i]);
}


header("Location: /");
die();

?>
