### Harvard Of Queens Wordle

## By James Worden

Students of St. John's University often refer to their school as the Harvard of Queens.
This wordle clone uses a list of bars, buildings, phrases, that many students are familiar with.

https://harvardofqueens.com/

---

Getting started:

1. Set the environment using one of the `set-env` NPM scripts. [NOTE: some environments may not be commited to git.]
2. Use either the `develop` or `build` NPM scripts to compile the code into one `index.html`, `main.css`, and `main.bundle.js` file in the `dist` directory. `develop` will continuously compile the code when changes are made and `build` will one do this once. [NOTE: Making changes to the partial HTML files may require running the `build` script to see changes.]
3. Find the `index.html` file in the `dist` directory and open it with a live server. The VSCode extension `Live Server` by Ritwick Dey is what I use for this.

---

Comments on the codebase:

I would like to move away from `html-webpack-partials-plugin` if possible for a couple reasons.

-   Each component has to be defined as a new instance of a `HtmlWebpackPartialPlugin()` with a directory to the html file and the name of the created web component; To make this process a little easier, I map an array of component names to an array of plugin instances. This little workaround won't scale well for nested components though.
-   As far as I know, there isn't a way to define where children are passed into partial html files. It looks like they are inserted as the first child element of the first element in the partial. There might be an area of the documentation I have not seen that covers this though.

I used it because I wanted to avoid a giant `index.html` file and I felt that Angular or React were overkill for this project. However, alternatives to avoid this obscure webpack configuration may be to:

-   Avoid webpack and only use HTML, CSS, JS files as the project is quite small.
-   Use a front-end framework like Gatsby to generate a simple static site with the power of React's state management.

---

Bugs to fix:

-   On Safari, the Request Word Modal is slightly off center vertically.
-   ~~On Safari, the Submit button in the request word modal has an increased `border-radius` style. I think it's related to the Submit button technically being an input. Regardless, the Cancel and Submit buttons should match in appearance.~~
-   Toast messages should stack on top of one another instead of canceling if one already exists on screen. Alternatively, we could just shorten the time that the toast message is on the screen so it's less of an obstruction to users.

---

Features to make:

-   ~~Have at least one hint assocated with each word because it's super difficult to guess big words.~~
-   Change the font family of the text within the modal; looks like generic bootstrap text but it's not.
-   Create a share feature where all of the user's guesses are transformed into a text message they can send on mobile.
-   ~~Style hint button so it looks like a button on a keyboard.~~

---

Code changes to make:

-   Have the tiles expand in size instead of being set with media queries. Sometimes the word may be three letters long but the boxes are super small, other times the word is 9 letters and they slightly extend off of a small resoloution screen.
-   When a user makes a guess, the keyboard colors are updated by adding a status class to it's div element. However, each key may already contain one of these classes and it's not removed before adding the new one. For example, a key may have the classes `incorrect` `correct` and ultimately it will be colored green ONLY BECAUSE the `correct` comes after the `incorrect` class in the CSS file. We should not rely on the CSS file for how the keys ought to be colored.
