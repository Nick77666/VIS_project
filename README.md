<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UWaterloo CS Co-Authorship Network</title>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; }
        .tooltip { position: absolute; text-align: center; padding: 5px; font: 12px sans-serif; background: lightsteelblue; border: 0px; border-radius: 8px; pointer-events: none; }
        .legend { font-size: 14px; }
    </style>
</head>
<body>
<h1>UWaterloo CS Co-Authorship Network</h1>
<p>This visualization showcases the collaboration patterns between faculty members in the UWaterloo CS department. Click on an author to view their co-authors. Click on an empty space to reset the view.</p>
<svg width="100%" height="800"></svg>
<script src="script.js"></script>
</body>
</html>
