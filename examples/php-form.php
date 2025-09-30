<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ethiopian Calendar - PHP Example</title>
    <link rel="stylesheet" href="../dist/ethcal-ui.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        h1 {
            color: #2196f3;
        }
        .form-group {
            margin: 20px 0;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
        }
        input[type="text"] {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            max-width: 400px;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            border: 1px solid #2196f3;
            background: #2196f3;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover {
            background: #1976d2;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>Ethiopian Calendar - PHP Integration</h1>
    
    <form method="POST" action="">
        <div class="form-group">
            <label for="birthdate">Birth Date (Ethiopian Calendar):</label>
            <input type="text" 
                   id="birthdate" 
                   name="ethiopian_date" 
                   placeholder="Click to select date" 
                   value="<?php echo htmlspecialchars($_POST['ethiopian_date'] ?? ''); ?>"
                   readonly>
            <input type="hidden" 
                   id="birthdate_gregorian" 
                   name="gregorian_date" 
                   value="<?php echo htmlspecialchars($_POST['gregorian_date'] ?? ''); ?>">
        </div>
        
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" 
                   id="name" 
                   name="name" 
                   placeholder="Enter your name"
                   value="<?php echo htmlspecialchars($_POST['name'] ?? ''); ?>">
        </div>
        
        <button type="submit">Submit</button>
    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['name'])) {
        $name = htmlspecialchars($_POST['name']);
        $ethiopianDate = htmlspecialchars($_POST['ethiopian_date'] ?? 'Not selected');
        $gregorianDate = htmlspecialchars($_POST['gregorian_date'] ?? 'Not selected');
        
        echo '<div class="result">';
        echo '<h3>Form Submitted Successfully!</h3>';
        echo '<p><strong>Name:</strong> ' . $name . '</p>';
        echo '<p><strong>Birth Date (Ethiopian):</strong> ' . $ethiopianDate . '</p>';
        echo '<p><strong>Birth Date (Gregorian):</strong> ' . $gregorianDate . '</p>';
        echo '</div>';
    }
    ?>

    <script type="module">
        import { EthiopianCalendarUI } from '../dist/ethcal-ui.esm.js';

        const dateInput = document.getElementById('birthdate');
        const gregorianInput = document.getElementById('birthdate_gregorian');

        const calendar = new EthiopianCalendarUI({
            inputElement: dateInput,
            onSelect: (date) => {
                const eth = date.ethiopian;
                const greg = date.gregorian;
                
                // Update visible input with Ethiopian date
                dateInput.value = `${eth.day}/${eth.month}/${eth.year}`;
                
                // Update hidden input with Gregorian date for server processing
                gregorianInput.value = greg.toISOString().split('T')[0];
            }
        });

        dateInput.addEventListener('click', () => {
            calendar.show();
        });
    </script>
</body>
</html>
