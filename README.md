GrepThink
========

[![Build Status](https://travis-ci.org/grepthink/grepthink.svg?branch=master)](https://travis-ci.org/grepthink/grepthink)
[![Coverage Status](https://coveralls.io/repos/github/grepthink/grepthink/badge.svg?branch=production)](https://coveralls.io/github/grepthink/grepthink?branch=production)

Build better teams, one match at a time!<br /><br />
Our Team:<br />
Sean Gordon<br />
Hugh Feng<br />
Trevor Ching<br />
Anjali Kanthilal<br />
Ali Alkaheli<br />
<br />
Fall17 Fork Changelog:<br />
10-18-17 4:27pm - Sean's change<br />
10-19-17 5:24pm - Hugh's change<br />
10-20-17 12:50pm - Sean added Release plan, Sprint 1 plan, and intro slides to ./docs/fall17<br />
10-20-17 1:35pm - Sean Synced fork with GrepThink upstream<br />
10-20-17 2:20pm - Sean added chat app under ./teamwork/apps and added Sprint 1 Report under ./docs/fall17<br />
10-23-17 10:35am - Sean added Sprint 2 plan and updated Sprint 1 Report in ./docs/fall17<br />
10-26-17 10:50pm - Trevor Messages should be routed to consumers and sent into a chat room along with basic error checking. Also made a basic chat html page
that only lists the chat rooms created. Chat rooms can be created through the admin page and users can be added into the room. Have not tested the actual chat
because I am unable to link into a chat room or create a chat room via a link when listing the chat rooms. So the message system is not tested yet, but the website
still loads.<br />
10-27-17 1:54pm - Anjali added chat side bar to _main_sidebar.html so it connects to chat.html<br />
10-27-17 2:32pm - Trevor, Basic messaging functions work, messages can be received from users in the same room.
Chat room still needs to be created and implemented into the grepthink base.html file.<br />
10-24-17 ->10-29-17 models are implemented, small fixes in various places, teying to get testing working. Please understand what you read, don't just copy<br />
11-1-17 12:30pm - Sean: Added sub urls from /chat (for ex. /chat/room1) and now the chatroom auto loads upon entering those sub-urls. Breadcrumbs are added for both view_chats and view_one_chat.<br />
11-2-17 8:20pm - Sean: Deleted unneeded code in chat.html, set proper leave in one_chat.html for a websocket disconnect, deleted unneeded copy file "chat - Copy.html". Working on user authenication next.<br />
11-3-17 12:37 - Hugh: get messages added, working much better.<br />
11-4-17 2:50pm - Trevor: Made projects and chat connected not by foreign key anymore. When a project is created a chat is created with it, when members are added to the project they are added to the
chat, and when someone is removed or leaves from the project they are removed from the chat. This should not interfere with current projects already in the datbase because it checks
for existing chats matching the project title name, which may cause other errors if a chat is created with the project name.......<br />
11-5-17 6:15pm - Sean: Added authentication to chat views. Only lists user's chatrooms in "/chat" (no longer all of them) and if someone tries to get get into a chat via url slug, checks if they are a member of the room.<br />
11-5-17 10:45pm - Sean: Added chat layout UI, loads adminlte template, & previous messages (scrolling isn't quite right yet). Newly sent messages also appear in the new chat box. Use the GREY button to send, working on GREEN, but it's not quite finished. Keeping the basic chat texts for now in case of bugs or for testing. Added Sprint 2 Report under docs/fall17.<br />
11-9-17 3:46pm - Trevor: Made chats connected to projects created with dash in the front. Need to make dashes not allowed in chat names when creating chat forms. Made the @ backend parsing assuming the frontend removes the @ sign. <br />
11-10-17 5:25pm - Sean: Added a "Creat Chatroom" on the "/chat" url. Takes you to a form where you can set an name and add users. After Submitting the form, takes you back to the "/chat" url.<br />
11-14-17 10:02pm - Anjali: Create side bar for Chat on main chat page. Edited chat.html. You can now see all your chat rooms on the side and create a new chatroom in the same place. <br />
11-14-17 10:24pm - Trevor: @ sign is now parsed and creates a link when found to a user profile or redirects to the chat. There might be better ways of doing it 'some people say' but this can be left as is I guess.<br />
11-14/15-17 - Hugh: alert function added, remove function added, just need to test and call<br />
11-15-17 2:58pm - Anjali: Edit Chat main page. Now has tabs on the top of the page rather than side.<br />
11-16-17 8:00pm - Sean: Added button and verification to leave a chatroom. Create chat now has you list the users you want to add instead of seeing every user on the website. Any users that do not exist cannot be added to the chatroom.<br />
11-17-17 12:00pm - Sean: Added button and form to invite users to an already created room. Invite currently adds them without their approval.<br />
11-19-17 10:40pm - Sean: AutoScrolls down to the last message sent in chat.js. Create chat won't create a room with no users (for example if you try to create with a bunch of non-valid usernames). Text bubbles correspond to the current user and other users (green & grep respectively).<br />
11-25-17 12:03pm - Trevor: Got the website and chat working on a test server for Heroku. Created a different settings.py file that has all the settings for the Heroku server.
Changed the Database URL; Changed the Redis URL; added an asgi file for running the websocket workers; PROCFILE has the settings for launching the server on Heroku; I left the original
settings.py so that we can still test stuff on localhost; Fixed some errors with adding members into chat; On the production server a Redis app needs to be installed with the web app;
Might need to change the asgi file because its a basic one, I don't fully understand how it works yet; Same for the PROCFILE with the workers it runs.<br />
11-28-17 - Hugh: chat fixed, enter and send works, all chats loaded, is possible to not receive so I might do a check loop or send a check message DM also almost done<br />
11-28-17 - Hugh: message loading is done, direct messages are done, I'm done<br />
11-28-17 - Sean: Can invite from Chat Tabs, reset the input form so that the text doesn't linger after you send it. Chat bubble changes. Profile Icons are not accurate.<br />
