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

    <h2>Additional Examples</h2>
    
    <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>With Ethiopic Numerals</h3>
        <input type="text" id="date_ethiopic" class="demo-input" placeholder="Select date" readonly style="width: 100%; max-width: 400px; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px;">
    </div>

    <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>With English Names</h3>
        <input type="text" id="date_english" class="demo-input" placeholder="Select date" readonly style="width: 100%; max-width: 400px; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px;">
    </div>

    <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>Merged View (Both Calendars in One)</h3>
        <input type="text" id="date_merged" class="demo-input" placeholder="Select date" readonly style="width: 100%; max-width: 400px; padding: 10px; font-size: 16px; border: 1px solid #ddd; border-radius: 4px;">
    </div>

    <script type="module">
        import { EthiopianCalendarUI } from '../dist/ethcal-ui.esm.js';

        // Main form calendar
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

        // Example with Ethiopic numerals
        const dateEthiopicInput = document.getElementById('date_ethiopic');
        const calendarEthiopic = new EthiopianCalendarUI({
            inputElement: dateEthiopicInput,
            useEthiopicNumbers: true,
            onSelect: (date) => {
                const eth = date.ethiopian;
                dateEthiopicInput.value = `${eth.day}/${eth.month}/${eth.year}`;
            }
        });

        dateEthiopicInput.addEventListener('click', () => {
            calendarEthiopic.show();
        });

        // Example with English names
        const dateEnglishInput = document.getElementById('date_english');
        const calendarEnglish = new EthiopianCalendarUI({
            inputElement: dateEnglishInput,
            useAmharic: false,
            onSelect: (date) => {
                const eth = date.ethiopian;
                dateEnglishInput.value = `${eth.day}/${eth.month}/${eth.year}`;
            }
        });

        dateEnglishInput.addEventListener('click', () => {
            calendarEnglish.show();
        });

        // Example with merged view
        const dateMergedInput = document.getElementById('date_merged');
        const calendarMerged = new EthiopianCalendarUI({
            inputElement: dateMergedInput,
            mergedView: true,
            primaryCalendar: 'ethiopian',
            onSelect: (date) => {
                const eth = date.ethiopian;
                dateMergedInput.value = `${eth.day}/${eth.month}/${eth.year}`;
            }
        });

        dateMergedInput.addEventListener('click', () => {
            calendarMerged.show();
        });
    </script>
</body>
</html>
