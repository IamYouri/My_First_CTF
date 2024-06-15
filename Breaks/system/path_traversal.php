<?php
if (isset($_GET['file'])) {
    $file = $_GET['file'];
    echo file_get_contents("uploads/" . $file);
} else {
    echo "Please provide a file using the 'file' parameter.";
}
?>
