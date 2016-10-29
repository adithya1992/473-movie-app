/* Array to hold movie objects*/
var Movies = [];

/**************** ************** **************  **************
        Main fucntion
************** ************** **************  ************** */
var main = function()
{
    retrieveMovies();
};

/**************** ************** **************  **************
        Function to get Json response file from /movie
************** ************** **************  ************** */
var retrieveMovies = function()
{
    $.get('/movie', function(result) {
        Movies = result;        //store movies from Json response into Movie aray
        displayMovies(Movies);
    });
};


/**************** ************** **************  **************
        Function to get Json response file from /movie
************** ************** **************  ************** */
var displayMovies = function(movies)
{
    var numberOfTiles = 3,
        begining = numberOfTiles-numberOfTiles, //always initialize as 0 to begining at first tile
        end = numberOfTiles,
        totalNumberOfMovies = movies.length;

    var indexes = [begining, end, numberOfTiles];
    var arrayOfTiles = [];

    //initialize array with elements
    arrayOfTiles = initializeTiles(movies);

    controlDisplay(indexes,arrayOfTiles, movies);
}

/**************** ************** **************  **************
        Function to control action on click
        requieres 3 parameters
        indexes an array of 3 elements : [ index of first tile to display, index of first tile to display , number Of Tiles to display]
        arrayOfTiles: elements to display
        movies an object containing the collection of movies to display
************** ************** **************  ************** */
var controlDisplay= function(indexes,arrayOfTiles,movies)
{
    var begining = indexes[0],
        end = indexes[1],
        numberOfTiles=indexes[2],
        totalNumberOfMovies = movies.length;

 //put all elements in array for first iteration

 //Action for left button when clicked
    slideMovies(indexes, arrayOfTiles, movies);
    $("#left-bttn").on("click", function() {
     if (begining < 1) {
            begining = totalNumberOfMovies - numberOfTiles;
            end = totalNumberOfMovies;

        } else {
            begining -= numberOfTiles;
            end -= numberOfTiles;
        }
        $('.movie-container')
            .transition({
                animation: 'fade left',
                duration: '.5s',
                onComplete: function() {
                    slideMovies([begining, end], arrayOfTiles, movies);
                    $('.movie-container')
                        .transition({
                            animation: 'fade right',
                            duration: '.5s',
                        });
                }
            });

    });

     //Action for right button when clicked
    $("#right-bttn").on("click", function() {
        if (end > totalNumberOfMovies - 1) {
            begining = 0;
            end = numberOfTiles;
        } else {
            begining += numberOfTiles;
            end += numberOfTiles;
        }
        $('.movie-container')
            .transition({
                animation: 'fade right',
                duration: '.5s',
                onComplete: function() {
                    slideMovies([begining, end], arrayOfTiles, movies);
                    $('.movie-container')
                        .transition({
                            animation: 'fade left',
                            duration: '.5s',
                        });
                }
            });
    });

     //Action for left arrow on keyboard when pressed
    $('body').keypress(function(event) {

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '37') {
            if (begining < 1) {
                begining = totalNumberOfMovies - numberOfTiles;
                end = totalNumberOfMovies;

            } else {
                begining -= numberOfTiles;
                end -= numberOfTiles;
            }
            $('.movie-container')
                .transition({
                    animation: 'fade right',
                    duration: '.7s',
                    onComplete: function() {
                        slideMovies([begining, end], arrayOfTiles, movies);
                        $('.movie-container')
                            .transition({
                                animation: 'fade left',
                                duration: '.7s',
                            });
                    }
                });
        }
    });

    //Action for left arrow on keyboard when pressed
    $('body').keypress(function(event) {

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '39') {
            if (end > totalNumberOfMovies - 1) {
                begining = 0;
                end = numberOfTiles;
            } else {
                begining += numberOfTiles;
                end += numberOfTiles;
            }
            $('.movie-container')
                .transition({
                    animation: 'fade left',
                    duration: '.7s',
                    onComplete: function() {
                        slideMovies([begining, end], arrayOfTiles, movies);
                        $('.movie-container')
                            .transition({
                                animation: 'fade right',
                                duration: '.7s',
                            });
                    }
                });
        }
    });

};


/**************** ************** **************  **************
        Function to control the movies presented to the user.
        Modifies indexes to change elements presented on screen
        requieres 3 parameters
        indexes an array of 3 elements : [ index of first tile to display, index of first tile to display , number Of Tiles to display]
        arrayOfTiles: elements to display
        movies an object containing the collection of movies to display
************** ************** **************  ************** */
var slideMovies = function(indexes, arrayOfTiles, movies) {
    var numberOfSquaresToShow = indexes[1];
    var i = indexes[0];
    var $container = $("body .ui.grid .twelve.wide.column .movie-container .ui.grid");
    var $img = $('body .twelve.wide.column .movie-container .ui.grid .five.wide.column .ui.card .image img');
    $($container).empty();
    for (i; i < numberOfSquaresToShow; ++i) {
        $container.append(arrayOfTiles[i]);
    }

    //Pop Up style
    $(arrayOfTiles).each(function(index) {

        //Remove click eventhandlers if they are set before to prevent duplication
        $(this).find('.image').unbind('click');
        $(this).find('.ui .green').unbind('click');
        $(this).find('.ui .red').unbind('click');


        //Add click eventhandler back
        $(this).find('.image').on('click', function() {
            $('.ui.modal').each(function() {
                $(this).remove();
            });
            appendModal(movies[index].movie);

        });

        //Add message when hover over image
        $('.special.cards .image').dimmer({
            on: 'hover'
        });

        // event handler for up voting on a movie
        $(this).find('.ui .green').on('click', function() {

            var input = { vote: "yes", title: movies[index].movie.Title };
            sendVoteToServer(input, index, this.closest('.extra'), $(this).parent());
        });

        // event handler for down voting on a movie
        $(this).find('.ui .red').on('click', function() {
            var input = { vote: "no", title: movies[index].movie.Title };
            sendVoteToServer(input, index, this.closest('.extra'), $(this).parent());
        });
    });

};


$(document).ready(main);
