<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta charset="utf-8"/>
        <title>Ontour.im</title>

        {{ HTML::style('css/styles.css'); }}
        {{ HTML::style('css/scrollbar.min.css'); }}
        {{ HTML::style('https://api.tiles.mapbox.com/mapbox.js/v1.6.2/mapbox.css'); }}

    </head>

    <body>
        <section id="sidebar">
            <section id="search"></section>
            <section id="events"></section>

            <div id="controls"></div>
            <div id="status"></div>
        </section>

        <div id="settings"></div>

        <div id="map"></div>

        <script data-main="js/main.js" src="js/lib/require.js"></script>
    </body>
</html>