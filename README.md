# ⚔️ Medieval Autocorrect ⚔️

*Hark! Transform thy modern tongue into the noble speech of olde!*

A Chrome extension that automatically transforms your typing into glorious Medieval English as you type. Watch in wonder as "Hello my friend" becomes "Hail mine companion" right before thine eyes! 

## 🏰 Features

- **Real-time Translation**: Every word thou typest is instantly transformed to Medieval English
- **400+ Word Dictionary**: A vast lexicon of period-appropriate vocabulary with multiple variations per word
- **Random Variations**: Each word has 2-5 medieval alternatives that are randomly selected, so typing the same sentence twice yields different results
- **Smart Capitalization**: Preserves your original capitalization (HELLO → HAIL, Hello → Hail)
- **Works (Almost) Everywhere**: Functions in most text inputs (including search bars), textareas, contentEditable elements, and online text editors (with the exception of certain editors like Google Docs)
- **Dynamic Content Support**: Automatically works with dynamically loaded elements in single-page applications
- **Multiple Input Types**: Supports text, search, email, URL, and tel input fields
- **Beautiful UI**: Medieval-themed popup with toggle controls
- **Dictionary Mode**: Uses local dictionary for instant translations (default)
- **LLM Mode**: Experimental API mode (documented as non-functional due to CORS restrictions)

## 🎭 Sample Transformations

**Modern English:**
> "Hello my friend, how are you today? I really think you are very brave and strong!"

**Medieval English (Example variation):**
> "Hail mine companion, how art thou this day? I forsooth ponder thou art most valiant and stout!"

**Another variation:**
> "Well met mine goodly fellow, how beest thee upon this day? I verily thinketh thee art exceeding bold and mighty!"

## 📜 Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `medieval-autocorrect` folder
6. The extension icon (⚔️ shield & sword) should appear in your toolbar!

## 🗡️ Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle "Enable Extension" to turn autocorrect on/off
3. Visit any website and start typing in a text field
4. Watch as thy words art transformed into Medieval English!
5. Toggle between Dictionary/LLM mode (note: LLM mode is decorative only)

## 🎪 Try These Sample Sentences

**Greetings:**
- "Hello my friend, how are you today?"
- "Hi there, please come here and talk with me"

**Actions:**
- "I need to go find my things before the morning"
- "Please help me carry this and bring it there"

**Storytelling:**
- "The old man was very tired and hungry, so he did eat and drink"
- "Although I was afraid before, I am not scared anymore because you are here with me now"

**Emphatic:**
- "Yes, I really do think that is very good indeed"
- "Maybe you were right, but I am not sure if that is true"

Type slowly to watch each word transform as you complete it!

## 🎨 Technical Details

- **Manifest Version**: V3 (latest Chrome extension standard)
- **Permissions**: Storage only (for saving settings)
- **Content Script**: Runs on all websites (`<all_urls>`)
- **Dictionary Size**: 400+ common English words
- **Average Variations**: 3-4 medieval alternatives per word
- **Storage**: Uses `chrome.storage.local` for persistent settings

## 🏛️ Dictionary Highlights

The extension includes translations for:
- **Pronouns**: you → thou/thee, your → thy/thine
- **Verbs**: are → art/beest, have → hast, go → goest/betake thyself
- **Greetings**: hello → hail/well met/greetings, goodbye → fare thee well/godspeed
- **Politeness**: please → prithee/pray/I beseech thee, thanks → gramercy/much obliged
- **Common words**: friend → companion/goodly fellow, man → gentleman/good sir/yeoman
- **Expressions**: really → forsooth/verily/in sooth, perhaps → mayhap/perchance/belike
- **Time**: now → anon/presently, tomorrow → on the morrow, evening → eve/eventide

## 🛡️ Known Limitations

- **LLM Mode**: The API toggle exists but is non-functional due to browser CORS restrictions. Content scripts cannot make external API calls. The extension will always use the local dictionary.
- **Extension Reloads**: If you reload the extension while using it, you may see "Extension context invalidated" briefly in console (handled gracefully with error catching)
- **Dictionary Coverage**: Only ~400 most common words are included. Uncommon words pass through unchanged.

## 🎯 Future Enhancements

- Add more obscure medieval vocabulary
- Support for Middle English mode (even more archaic!)
- Shakespearean mode
- Pirate mode 🏴‍☠️
- Customizable dictionary
- Whitelist/blacklist websites

## 🤝 Contributing

Feel free to expand the dictionary! The format is simple:
```javascript
"modernWord": ["medieval1", "medieval2", "medieval3"]
```

Add your entries to the `dictionary` object in [content.js](content.js).

## 📝 License

MIT License - Use freely, share widely, translate boldly!

## 🎉 Credits

Created with love for all ye who wisheth to speak as the olden folk did!

*Fare thee well, and may thy words ever be merry and quaint!* ⚔️🏰