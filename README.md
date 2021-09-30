# Todo List
* Add a crafting/kitchen system
* Add tons more items and emojis for them
* More ways to earn money and love
* Add gambling possibly with other players


# Change Logs
List of changelogs after the game

## Big Overhaul
* Added game commands everything works until this point.
* Added hack command as well for debug purposes.
* Added user, item, shop tables to the database.
* Fixed both major and minor bugs.
* Categorized all of the commands.

## Sharding
* Added sharding to the bot
* Adding emojis that can be needed for the game

## Changing Database
* Changed to postgresql from sqlite because of heroku
* There are still some potential bugs because of that
* Commiting the changes to see if those bugs occur on heroku too
* Fixed command manager bug
* Fixed prefix table structure

## Game Improvemenets
* Removed bunch of unnecessary stuff
* Fixed previous bugs
* Praying can't give or take 0 💸 anymore
* You can buy multiple items now
* Heaven Test has some bugs
* Commiting the changes to see if those bugs occur on heroku too
### Fixing bugs
* Caused by a function that closes the sequelize connection
* Since the module it was in has gone, it closes the main connection
* Check the functions before carrying them to another modules
* Removed code snippet from shop
### Fixing bugs 2
* Fixed type error on Prefixes

## Game and Database Update
* Fixed type error on UserItems
* Fixed case sensitive prefix detection
* Fixed case sensitive name detection on buy command
* Fixed a bug while buying multiple items, amount was appending to the item amount as a string instead of adding them as integers
* Changed praying with begging
* Praying now gives love every 5 minutes also can pray for others
* Table UserItems, didn't need seperate image column
* Enhanced UX
* Added new items to prepare for crafting/kitchen update
### Fixing bugs 3
* Praying is now functional
* Fixed a bug caused by switching get functions of currency to async
* Fixed gifting bug caused by referancing a value after it's been destroyed

## Game and Database Update
* Give command now creates an user
* Added 2 new tables to the database and changed shop table with Items table
* Changed the dbobjects accordingly
* Added make command and recipes to craft items using other items
* Game commands have been tested for every case for no errors or bug
* Fixed previous bugs
### Fixing bugs 4
* Fixed a syntax error
* Fixed prefix error on a new server
* Added randnum command
## Moderation Update
* Added clear messages command
* Added custom embed command
* Fixed a bug

## Moderation Update
* Added mute command
* Added ban command
* Added kick command
### Additional stuff
* Added poll command
* Fixed bugs about ban, kick, mute
* Fixed bug from help
* Improved poll command

## Music Update
* Added loop command
* Improved ux a bit

## Additional Stuff
* Increased the bitrate of music to 128 kbps
* Added work command with 60 seconds cooldown
* Added stories for work command
* Changed the Users tables accordingly
* Decreased the beg cooldown to 5 from 15
* Changed == to === on all commands for better performance
### Additional Stuff
* Fixed bugs on poll and embed commands
* Added a warning on skip command if there is a loop
* Fixed extra spaces on work command
* Added some story on work command
* Fixed leaderboard reset after a bot reset (Needs improvement)
* Added love count to the balance command

## Overhaul
* Added info and bilgi commands for game info
* Added member command for adding Member role to new members
* Changed table name prefixes to guildconfigs to keep track of more than just prefix
* Made all necessary changes for the name change
* Check what's wrong with poll (DONE : YES) 'Don't use replaceAll for strings'
### Poll Emoji Fix
* Changed regex for emoji part so it catches more
### Youtube Music Fix
* Updated ytdl-core to the latest version
* Changed revealed to revealKey because it had been changed

## Music update
* Made an overhaul/update to the music system
* Now supports playlists
* Added queue command
* Links doesn't search anymore, using them directly on ytdl
* Join and leave commands were added
* Bot leaves after 120 seconds (2 minutes) of inactivity
* Fixed a bug caused by an incompleted line of code