# Instanews App

A one-page, responsive website that allows a user to filter top news story categories via the New York Times API.



![Preview](images/_preview/preview_instanews_0.jpg)

[![gulp](https://img.shields.io/badge/gulp-4.0.2-brightgreen.svg)](https://github.com/gulpjs/gulp)
[![gulp-sass](https://img.shields.io/badge/gulp--sass-4.0.2-brightgreen.svg)](https://github.com/dlmanning/gulp-sass)
[![webpack-stream](https://img.shields.io/badge/webpack--stream-5.2.1-brightgreen.svg)](https://github.com/shama/webpack-stream)
[![jQquery](https://img.shields.io/badge/jQuery-3.4.1-brightgreen.svg)](https://jquery.com/)

[![browser-sync](https://img.shields.io/badge/browser--sync-2.26.7-green.svg)](https://github.com/BrowserSync/browser-sync)
[![gulp-autoprefixer](https://img.shields.io/badge/gulp--autoprefixer-4.1.0-green.svg)](https://github.com/sindresorhus/gulp-autoprefixer)
[![gulp-cssnano](https://img.shields.io/badge/gulp--cssnano-2.1.3-green.svg)](https://github.com/ben-eb/gulp-cssnano)
[![gulp-eslint](https://img.shields.io/badge/gulp--eslint-6.0.0-green.svg)](https://github.com/adametry/gulp-eslint)
[![gulp-prettyerror](https://img.shields.io/badge/gulp--prettyerror-1.2.1-green.svg)](https://github.com/andidittrich/gulp-prettyerror)
[![gulp-rename](https://img.shields.io/badge/gulp--rename-1.4.0-green.svg)](https://github.com/hparra/gulp-rename)
[![gulp-terser](https://img.shields.io/badge/gulp--terser-1.2.0-green.svg)](https://github.com/duan602728596/gulp-terser)

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
&nbsp;

&nbsp;

---
&nbsp;
## Dependencies

I am using gulp to compile SASS, and to concatenate and minify Stylesheets and Javascript.

&nbsp;

**1. gulp & other gulp relevant dependencies**
- `gulpfile.js` is used to gererate the concatenated and minified CSS and Javascript files.

- Main stylesheet file(`/sass/style.scss`) is optimized with `gulp-autoprefixer` and `gulp-cssnano`.

    - [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) : It takes the CSS file and rewrite properties with adding prefixes for every last 2 versions of browsers.

    - [gulp-cssnano](https://www.npmjs.com/package/gulp-cssnano) : It creates the smallest possible CSS.

    - Snippet for *gulp sass task* to export a new file for the production :
    ```javascript
    gulp.task('sass', function() {
        return gulp
            .src('./sass/style.scss')
            .pipe(prettyError())
            .pipe(sass())
            .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
            }),
            )
            .pipe(gulp.dest('./build/css'))
            .pipe(cssnano())
            .pipe(rename('style.min.css'))
            .pipe(gulp.dest('./build/css'));
    });
    ```
    
- Javascript files in the folder(`/js/*`) is optimized with `webpack-stream` and `gulp-terser`.

    - [webpack-stream](https://www.npmjs.com/package/webpack-stream) : It merges all Javascript files into `bundle.js`.

    - [gulp-terser](https://www.npmjs.com/package/gulp-terser) : It compresses es6+ code.

    - Snippet for *gulp bundle task* to export a new file for the production :
    ```javascript
    gulp.task(
        "bundle",
        gulp.series("lint", function webpackBundler() {
            return gulp
            .src("./js/*.js")
            .pipe(
                webpack({
                output: {
                    filename: "bundle.js"
                }
                })
            )
            .pipe(terser())
            .pipe(rename({ extname: '.min.js' }))
            .pipe(gulp.dest("./build/js"));
        })
    );
    ```
&nbsp;

**2.Sass / CSS**
- Using SCSS flavor of Sass

- `/sass/style.scss` is the main file, which imports everything else. The included files are broken up by content type with mixins. Imported files:

    - _reset.scss : [(Eric Meyer reset)](http://meyerweb.com/eric/tools/css/reset/) A reset stylesheet to reduce browser inconsistencies in things like default line heights, margins and font sizes of headings, and so on.

    - _variables.scss : Reusable variables throughout the stylesheet such as breakpoints, colors, and other css values.

    - _mixins.scss : Mixins and placeholder classes which are the groups of CSS declarations to reuse throughout the site.

    - _fonts.scss : Imported web fonts. 

    - _main.scss : Basic styles for the site.


- [CSS - Font Awesome](https://fontawesome.com/) : A popular icon collection to reach intuitively the largest amount of people possible.

- [CSS - Animate](https://daneden.github.io/animate.css/) : Cross-browser css animations.
&nbsp;

&nbsp;

---
&nbsp;
## Extra features

**1. Accessibility** : Allow the keyboard to navitage the site.

![Preview](images/_preview/preview_instanews_1.jpg)
- Press `Tab` key to navigate the site, `Enter` key to select the option from the select menu, and `Esc` key to close the opened select menu.

- The select element is highlighted in blue when focused or hovered. Also the selected article shows in the white background with the title and date.

- The first focused element is for `refreshing the page`.

&nbsp;

**2. Pre-loader** : Show the loading screen while the articles are loading.

![Preview](images/_preview/preview_instanews_2.jpg)
- The loading screen has the spinning wheel image and loading text. Its background is blurred and opaque which creates dramatic transition to the next screen.

&nbsp;

**3. Warning box** : If same section is chosen, display the warning box at the bottom and prevent from calling same data.

![Preview](images/_preview/preview_instanews_3.jpg)

&nbsp;

**4. customSelect.js** : Create a custom select box with exisiting the select element.

- **Usage :**

    1. Create `<select>` and `<option>` elements with values and texts in the html file.
        ```html
        <!-- html -->

        <select>
            <option value="home">Home</option>
            <option value="arts">Arts</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
            <option value="fashion">Fashion</option>
        </select>
        ```

    2. Assign `id` and `class` for the `<select>` element. Then hide the element with CSS property `display: none`.
        ```html
        <!-- html -->

        <select id="some_ID" class="any_class">
            <option>
                ...
                ...
        ```
        ```css
        /* Scss */

        .any_class { display: none; }
        ```

    3. Initiate with the javascript function `CustomSelect()`
        ```javascript
        // Javascript

        $(document).ready(function(){
            
            CustomSelect(); 
            // Must be included inside of DOM ready function.
            
        });
        ```

    4. Set options to activate the functions.
        ```javascript
        // Javascript

        CustomSelect({
            selectElementID: '#some_ID',
            // (required) assign the id of the existing select element in the html file.
            
            returnValue: true, 
            // returns value to #hiddenInput when an option is selected

            afterSelected: function(){
            // functions after the option is selected  
            }
            
        });
         ```
    
    5. Add styles for the custom select box.
        ```css
        /* Scss */

        .selectDefaultBox, .selectContainer {
            width: 100%;
            min-width: 120px;
            font-size: 0.8rem;
            border-radius: 0.25rem;
            transition: .3s;
            cursor: pointer;
        }

        .selectDefaultBox { 
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: $color-main-font;
            color:  $color-main-bg;
            padding: 0.8rem 0.6rem;
            &:focus, &:hover {
                @extend %focusBox;
            }

            &::after {
                position: relative;
                content: '\f078';
                font-family: 'FontAwesome';
            }
        }

        .selectContainer {
            visibility: hidden;
            position: absolute;
            background: rgba(0,0,0,0.92);
            box-shadow: 0 0 48px rgba(255,255,255,0.5);

            &.show {
                z-index: 100;
                visibility: visible;
            }
            .optionContainer { 
                position: relative;
                &:focus, &:hover {
                    @extend %focusBox;
                    background-color: $color-main-font;
                    .optionText {
                        color: $color-main-bg;
                    }
                }
                &::after {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    content: '';
                    width: 100%;
                    height: 1px;
                    background-color: rgba(255,255,255,0.3);
                }
                &:first-child {
                    border-radius: .25rem .25rem 0 0;
                }
                &:last-child {
                    border-radius: 0 0 .25rem .25rem;
                    &::after {
                        display: none;
                    }
                }
                .optionText {
                    font-size: 0.8rem;
                    padding: 0.8rem 0.6rem;
                    color: $color-main-font;
                }
            }
        }
        ```


&nbsp;

---
&nbsp;
## License
- Structural code is open-sourced under the [MIT license](/LICENSE.md). 
&nbsp;

- Learning materials content is copyright (c) 2019 RED Academy.

<3
