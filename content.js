let isTransforming = false;

// Check if we have permission to run on this page (especially for Google Docs)
async function checkPagePermission() {
  if (window.location.hostname.includes('google.com')) {
    try {
      const hasPermission = await chrome.permissions.contains({
        origins: [
          "*://docs.google.com/*",
          "*://*.google.com/*"
        ]
      });
      
      if (!hasPermission) {
        console.log('Medieval Autocorrect: No permission for Google sites. Please grant access in the extension popup.');
        return false;
      }
    } catch (error) {
      // If permission check fails, continue anyway (might be running on non-Google page)
      console.log('Medieval Autocorrect: Permission check skipped');
    }
  }
  return true;
}

// Medieval English dictionary - all values are arrays for consistent random selection
const dictionary = {
  // Pronouns
  "you": ["thou", "thee"],
  "your": ["thy", "thine"],
  "yours": ["thine"],
  "yourself": ["thyself"],
  
  // Common verbs - to be
  "are": ["art", "beest"],
  "were": ["wert", "wast"],
  "am": ["am"],
  "is": ["is", "beeth"],
  "was": ["was"],
  "been": ["been"],
  "being": ["being"],
  
  // Modal verbs
  "have": ["hast", "have"],
  "has": ["hath", "possesseth"],
  "had": ["hadst", "hath had"],
  "do": ["dost", "doest"],
  "does": ["doth", "doeth"],
  "did": ["didst", "hath done"],
  "will": ["shalt", "wilt"],
  "would": ["wouldst", "wouldest"],
  "should": ["shouldst", "shouldest"],
  "shall": ["shalt"],
  "must": ["must needs", "must"],
  "can": ["canst", "mayest"],
  "could": ["couldst", "mightst"],
  "may": ["mayst", "mayest"],
  "might": ["mightst", "mightest"],
  
  // Time expressions
  "before": ["ere", "afore"],
  "after": ["hereafter", "thereafter"],
  "now": ["anon", "presently", "forthwith"],
  "soon": ["anon", "presently", "betimes"],
  "later": ["anon", "hereafter"],
  "never": ["ne'er", "nevermore"],
  "not": ["nay", "not"],
  "today": ["this day", "upon this day"],
  "tonight": ["this eve", "this eventide"],
  "yesterday": ["yesternight", "yester eve"],
  "tomorrow": ["on the morrow", "the morrow"],
  "morning": ["morn", "morrow"],
  "evening": ["eve", "eventide", "vespers"],
  "night": ["eve", "eventide"],
  "day": ["day"],
  "week": ["sennight"],
  "month": ["month"],
  "year": ["year", "twelvemonth"],
  
  // Affirmations & negations
  "yes": ["yea", "aye", "verily", "forsooth"],
  "no": ["nay", "nay verily"],
  "okay": ["aye", "verily"],
  "ok": ["aye"],
  "alright": ["aye then", "verily"],
  
  // Possessives
  "my": ["mine", "my"],
  "me": ["me"],
  "i": ["I"],
  "we": ["we"],
  "us": ["us"],
  "our": ["our"],
  
  // Pronouns & references
  "it": ["it"],
  "this": ["this"],
  "that": ["yon", "yonder", "that"],
  "these": ["these"],
  "those": ["yon", "yonder"],
  "there": ["thither", "yonder"],
  "here": ["hither", "here"],
  "where": ["whither", "whereabouts"],
  "everywhere": ["hither and thither"],
  
  // People
  "friend": ["companion", "goodly fellow", "good sir", "comrade"],
  "friends": ["companions", "goodly fellows", "good sirs", "comrades"],
  "man": ["gentleman", "good sir", "fellow", "yeoman"],
  "woman": ["lady", "maiden", "damsel", "goodwife"],
  "men": ["gentlemen", "fellows", "yeomen"],
  "women": ["ladies", "maidens", "damsels"],
  "boy": ["lad", "youth"],
  "girl": ["lass", "maiden"],
  "children": ["younglings", "whelps"],
  "child": ["youngling", "whelp"],
  "people": ["folk", "goodly folk", "souls"],
  "person": ["soul", "being", "one"],
  "everyone": ["all folk", "all souls"],
  "someone": ["one", "some soul"],
  "anyone": ["any soul", "any one"],
  "nobody": ["no one", "nary a soul"],
  "everybody": ["all folk"],
  "somebody": ["some soul"],
  
  // Greetings & farewells
  "hello": ["hail", "well met", "greetings", "good morrow"],
  "hi": ["hail", "well met", "good day"],
  "hey": ["hark", "hail", "ho there"],
  "goodbye": ["fare thee well", "godspeed", "good morrow"],
  "bye": ["fare thee well", "farewell"],
  "welcome": ["well met", "thou art welcome"],
  "see": ["seeth", "beholdeth", "gazeth upon"],
  
  // Politeness
  "please": ["prithee", "pray", "I beseech thee"],
  "thanks": ["gramercy", "much obliged", "I thank thee", "thankee"],
  "thank": ["gramercy", "I thank thee"],
  "sorry": ["I beg pardon", "forgive me", "I crave pardon"],
  "excuse": ["pardon", "I beg thy pardon"],
  "pardon": ["pardon me", "I beg pardon"],
  
  // Mental actions
  "think": ["thinketh", "doth think", "ponder"],
  "thought": ["thought", "pondered"],
  "believe": ["believeth", "doth believe"],
  "know": ["knoweth", "doth know", "ken"],
  "knew": ["knew", "kenned"],
  "understand": ["comprehend", "fathom", "ken"],
  "remember": ["recall", "bethink"],
  "forget": ["forget"],
  "mean": ["meaneth", "intendeth"],
  "meant": ["meant", "intended"],
  "consider": ["ponder", "bethink"],
  "realize": ["perceive", "comprehend"],
  "imagine": ["fancy", "conceive"],
  "wonder": ["marvel", "ponder"],
  "doubt": ["mistrust", "misdoubt"],
  
  // Desires & feelings
  "want": ["wanteth", "desirest", "wisheth for"],
  "need": ["needeth", "requireth", "hath need of"],
  "like": ["liketh", "fancies"],
  "love": ["loveth", "doth adore"],
  "hate": ["loathe", "despise", "abhor"],
  "wish": ["wisheth", "desirest"],
  "hope": ["hopeth", "doth hope"],
  "prefer": ["favor", "choose"],
  "enjoy": ["relish", "delight in"],
  "feel": ["feeleth", "doth feel"],
  "care": ["careth", "hath concern"],
  
  // Motion verbs
  "go": ["goest", "betake thyself", "proceed"],
  "come": ["cometh", "approach"],
  "walk": ["walketh", "amble"],
  "run": ["runneth", "hasten"],
  "move": ["moveth", "stir"],
  "return": ["returneth", "come back"],
  "leave": ["leaveth", "depart", "take leave"],
  "stay": ["tarry", "remain", "abide"],
  "wait": ["tarry", "bide", "abide"],
  "arrive": ["arrive", "come hither"],
  "depart": ["depart", "take leave"],
  "enter": ["entereth", "come in"],
  "exit": ["departeth", "take leave"],
  "follow": ["followeth", "pursue"],
  "lead": ["leadeth", "guide"],
  "travel": ["journey", "voyage"],
  "visit": ["call upon", "visiteth"],
  "reach": ["attain", "arrive at"],
  
  // Action verbs
  "stop": ["cease", "halt", "desist"],
  "begin": ["commence", "begin"],
  "start": ["commence", "embark"],
  "end": ["cease", "conclude"],
  "finish": ["complete", "conclude"],
  "continue": ["proceed", "carry on"],
  "change": ["alter", "transform"],
  "turn": ["turn", "turneth"],
  "open": ["open", "unfasten"],
  "close": ["close", "shut"],
  "cut": ["cut", "cleave"],
  "write": ["write", "scribe"],
  "read": ["read", "peruse"],
  "draw": ["draw", "sketch"],
  "paint": ["paint"],
  
  // Communication verbs
  "see": ["seeth", "beholdeth", "gazeth upon"],
  "look": ["looketh", "gaze upon", "behold"],
  "watch": ["observe", "witness", "behold"],
  "observe": ["observe", "mark"],
  "notice": ["mark", "note"],
  "hear": ["heareth", "doth hear"],
  "listen": ["hearken", "give ear"],
  "speak": ["speaketh", "doth speak", "utter"],
  "talk": ["converse", "discourse", "parlance"],
  "say": ["sayeth", "doth say", "utter"],
  "tell": ["telleth", "relate", "recount"],
  "ask": ["asketh", "inquire", "beseech"],
  "answer": ["answereth", "reply"],
  "reply": ["reply", "respond"],
  "call": ["calleth", "summon", "hail"],
  "shout": ["cry out", "proclaim"],
  "whisper": ["whisper"],
  "explain": ["expound", "explaineth"],
  "describe": ["describe", "depict"],
  "mention": ["mention", "speak of"],
  "discuss": ["discourse upon", "speak of"],
  "argue": ["dispute", "quarrel"],
  
  // Physical actions
  "take": ["taketh", "seize"],
  "give": ["giveth", "bestow", "grant"],
  "bring": ["bringeth", "bear hither"],
  "carry": ["beareth", "carry"],
  "hold": ["holdeth", "grasp"],
  "keep": ["keepeth", "retain", "hold fast"],
  "put": ["putteth", "place"],
  "place": ["place", "putteth"],
  "set": ["set", "place"],
  "lay": ["lay", "place"],
  "throw": ["cast", "hurl"],
  "catch": ["catch", "seize"],
  "drop": ["drop", "let fall"],
  "lift": ["lift", "raise"],
  "pull": ["pull", "draw"],
  "push": ["push", "thrust"],
  "touch": ["touch", "feel"],
  "grab": ["seize", "grasp"],
  "release": ["release", "unhand"],
  
  // Show & find
  "show": ["showeth", "display", "reveal"],
  "hide": ["conceal", "secrete"],
  "reveal": ["reveal", "make known"],
  "find": ["findeth", "discover"],
  "seek": ["seeketh", "quest for"],
  "search": ["quest for", "seek"],
  "lose": ["lose"],
  "discover": ["discover", "uncover"],
  
  // Obtain & exchange
  "get": ["getteth", "obtain", "procure"],
  "obtain": ["obtain", "procure"],
  "receive": ["receiveth", "accept"],
  "accept": ["accept", "receiveth"],
  "buy": ["purchaseth", "buy"],
  "sell": ["selleth", "vend"],
  "pay": ["pay", "recompense"],
  "cost": ["cost"],
  "own": ["possess", "own"],
  "have": ["hast", "possess"],
  
  // Creation & destruction
  "make": ["maketh", "fashion", "craft"],
  "create": ["createth", "fashion"],
  "build": ["buildeth", "construct"],
  "destroy": ["destroyeth", "ruin"],
  "break": ["breaketh", "shatter"],
  "fix": ["mendeth", "repair"],
  "repair": ["repair", "mend"],
  "damage": ["damage", "harm"],
  
  // Help & work
  "help": ["helpeth", "aideth", "assist"],
  "aid": ["aid", "assist"],
  "serve": ["serve", "attend"],
  "try": ["tryeth", "endeavor", "attempt"],
  "attempt": ["endeavor", "essayeth"],
  "work": ["toil", "labor"],
  "labor": ["toil", "labor"],
  "rest": ["rest", "repose"],
  "play": ["frolic", "make merry"],
  "use": ["useth", "employ"],
  "practice": ["practice"],
  
  // Living & dying
  "eat": ["eateth", "sup", "dine"],
  "drink": ["drinketh", "imbibe"],
  "sleep": ["slumber", "repose"],
  "wake": ["waketh", "rouse"],
  "die": ["perish", "expire"],
  "live": ["liveth", "dwell"],
  "exist": ["exist"],
  "survive": ["survive", "endure"],
  "grow": ["groweth", "increase"],
  "become": ["become", "grow"],
  
  // Combat & conflict
  "fight": ["doth battle", "combat"],
  "attack": ["assail", "assault"],
  "defend": ["defend", "protect"],
  "protect": ["protect", "guard"],
  "kill": ["slay", "smite"],
  "hurt": ["hurt", "wound"],
  "wound": ["wound", "injure"],
  "defeat": ["vanquish", "overcome"],
  "win": ["triumph", "prevail"],
  "lose": ["lose"],
  
  // Adjectives - quality
  "good": ["good", "goodly", "fine"],
  "bad": ["ill", "wicked", "poor"],
  "great": ["great", "grand", "mighty"],
  "small": ["small", "wee"],
  "big": ["great", "large"],
  "large": ["large", "great"],
  "little": ["little", "small"],
  "long": ["long"],
  "short": ["short", "brief"],
  "tall": ["tall", "lofty"],
  "high": ["high", "lofty"],
  "low": ["low"],
  "wide": ["wide", "broad"],
  "narrow": ["narrow"],
  "thick": ["thick"],
  "thin": ["thin", "slender"],
  "deep": ["deep"],
  "shallow": ["shallow"],
  
  // Adjectives - age & time
  "old": ["olde", "ancient", "aged"],
  "new": ["new"],
  "young": ["youthful", "young"],
  "ancient": ["ancient", "olden"],
  "modern": ["newfangled"],
  "recent": ["late"],
  "early": ["early", "betimes"],
  "late": ["late", "tardy"],
  "quick": ["swift", "quick"],
  "fast": ["swift", "fleet"],
  "slow": ["slow", "tardy"],
  
  // Adjectives - appearance
  "beautiful": ["fair", "comely", "beauteous"],
  "pretty": ["fair", "comely"],
  "ugly": ["hideous", "unseemly"],
  "handsome": ["comely", "fair"],
  "plain": ["plain", "simple"],
  "strange": ["strange", "queer"],
  "different": ["different", "sundry"],
  "same": ["same", "selfsame"],
  "similar": ["akin", "like unto"],
  
  // Adjectives - character
  "strong": ["stalwart", "stout", "mighty"],
  "weak": ["feeble", "frail"],
  "brave": ["valiant", "bold", "stout-hearted"],
  "bold": ["bold", "valiant"],
  "afraid": ["afeard", "fearful"],
  "scared": ["afeard", "frightened"],
  "careful": ["heedful", "wary"],
  "dangerous": ["perilous", "dire"],
  "safe": ["safe", "secure"],
  "wise": ["sage", "wise"],
  "smart": ["clever", "wise"],
  "stupid": ["daft", "foolish"],
  "foolish": ["foolhardy", "daft"],
  "clever": ["clever", "cunning"],
  "crazy": ["mad", "addled"],
  "mad": ["mad", "wroth"],
  "sane": ["sound of mind"],
  
  // Adjectives - emotion
  "happy": ["merry", "mirthful", "glad"],
  "glad": ["glad", "merry"],
  "sad": ["woeful", "sorrowful", "doleful"],
  "angry": ["wroth", "ireful"],
  "calm": ["tranquil", "serene"],
  "excited": ["stirred", "aroused"],
  "worried": ["troubled", "vexed"],
  "surprised": ["astonished", "amazed"],
  "amazed": ["amazed", "astonished"],
  "confused": ["bewildered", "perplexed"],
  "proud": ["proud", "haughty"],
  "humble": ["humble", "meek"],
  "lonely": ["lonesome", "forlorn"],
  
  // Adjectives - physical state
  "tired": ["weary", "fatigued"],
  "hungry": ["famished", "ravenous"],
  "thirsty": ["athirst", "parched"],
  "sick": ["ailing", "ill"],
  "healthy": ["hale", "hearty"],
  "well": ["hale", "in good health"],
  "ill": ["ill", "ailing"],
  "dead": ["dead", "deceased"],
  "alive": ["living", "quick"],
  "full": ["full", "replete"],
  "empty": ["empty", "void"],
  "clean": ["clean"],
  "dirty": ["filthy", "soiled"],
  
  // Adjectives - importance
  "important": ["of import", "weighty"],
  "necessary": ["needful", "requisite"],
  "useful": ["useful", "of use"],
  "useless": ["of no use", "vain"],
  "possible": ["possible"],
  "impossible": ["impossible", "not to be"],
  "easy": ["easy", "simple"],
  "hard": ["hard", "difficult"],
  "difficult": ["difficult", "arduous"],
  "simple": ["simple", "plain"],
  "complex": ["complex", "intricate"],
  "clear": ["clear", "plain"],
  "certain": ["certain", "sure"],
  "sure": ["sure", "certain"],
  "true": ["true", "sooth"],
  "false": ["false", "untrue"],
  "right": ["right", "correct"],
  "wrong": ["wrong", "amiss"],
  "correct": ["correct", "right"],
  
  // Adverbs
  "with": ["with"],
  "from": ["from"],
  "about": ["about", "concerning"],
  "very": ["verily", "most", "exceeding"],
  "really": ["forsooth", "truly", "verily", "in sooth"],
  "truly": ["forsooth", "verily", "in truth"],
  "indeed": ["forsooth", "in sooth", "verily"],
  "actually": ["in truth", "forsooth"],
  "just": ["but", "merely"],
  "only": ["but", "merely", "only"],
  "almost": ["nigh", "well nigh", "almost"],
  "quite": ["quite", "full"],
  "too": ["too", "overmuch"],
  "enough": ["enough", "enow"],
  "more": ["more"],
  "most": ["most"],
  "less": ["less"],
  "least": ["least"],
  "much": ["much"],
  "many": ["many"],
  "few": ["few"],
  "several": ["several", "sundry"],
  "some": ["some"],
  "any": ["any"],
  "all": ["all"],
  "every": ["every", "each"],
  "each": ["each"],
  "both": ["both"],
  "either": ["either"],
  "neither": ["neither", "nor"],
  
  // Certainty & possibility
  "perhaps": ["mayhap", "perchance", "belike"],
  "maybe": ["mayhap", "perchance"],
  "probably": ["belike", "likely"],
  "certainly": ["certes", "assuredly"],
  
  // Frequency
  "always": ["ever", "always"],
  "forever": ["evermore", "for aye"],
  "often": ["oft", "oftentimes"],
  "sometimes": ["betimes", "whiles", "oft"],
  "never": ["ne'er", "never"],
  "rarely": ["seldom", "rarely"],
  "seldom": ["seldom"],
  "usually": ["wont", "customarily"],
  "again": ["again", "anew"],
  
  // Conjunctions
  "because": ["for", "as", "since"],
  "if": ["if", "an"],
  "then": ["then"],
  "but": ["but", "yet"],
  "and": ["and"],
  "or": ["or"],
  "so": ["thus", "so"],
  "therefore": ["thus", "wherefore", "ergo"],
  "however": ["howbeit", "yet", "nevertheless"],
  "though": ["though", "albeit"],
  "although": ["albeit", "though"],
  "unless": ["unless", "save"],
  "until": ["until", "till"],
  "since": ["since"],
  "when": ["when", "whilst"],
  "while": ["whilst", "while"],
  "during": ["whilst", "during"],
  
  // Prepositions
  "among": ["amongst", "amid"],
  "between": ["betwixt", "between"],
  "around": ["about", "round"],
  "through": ["through"],
  "across": ["athwart", "across"],
  "above": ["above"],
  "below": ["below", "beneath"],
  "beneath": ["beneath", "neath"],
  "behind": ["behind"],
  "beyond": ["beyond", "yon"],
  "near": ["nigh", "near"],
  "far": ["far", "distant"],
  "inside": ["within"],
  "outside": ["without", "beyond"],
  "toward": ["toward", "towards"],
  "against": ["against", "gainst"],
  "without": ["without"],
  "within": ["within"],
  
  // Other common words
  "time": ["time"],
  "place": ["place"],
  "way": ["way", "manner"],
  "thing": ["thing"],
  "nothing": ["naught", "nothing"],
  "something": ["somewhat", "aught"],
  "anything": ["aught"],
  "everything": ["all", "all things"],
  "world": ["world", "realm"],
  "life": ["life"],
  "death": ["death"],
  "name": ["name"],
  "word": ["word"],
  "question": ["query", "question"],
  "answer": ["answer", "reply"],
  "problem": ["problem", "trouble"],
  "trouble": ["trouble", "woe"],
  "reason": ["reason", "cause"],
  "idea": ["notion", "thought"],
  "fact": ["fact", "truth"],
  "story": ["tale", "story"],
  "part": ["part"],
  "whole": ["whole", "entire"],
  "side": ["side"],
  "number": ["number"],
  "kind": ["kind", "sort"],
  "type": ["manner", "kind"]
};

// Get translation from dictionary - all values are arrays
function getTranslation(word) {
  const lower = word.toLowerCase();
  const translation = dictionary[lower];
  
  if (!translation) return null;
  
  // Pick random translation from array
  const randomIndex = Math.floor(Math.random() * translation.length);
  // console.log(randomIndex);
  return translation[randomIndex];
}

function preserveCase(original, replacement) {
  if (!original || !replacement) return replacement;
  
  // Check if original is all uppercase
  if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  }
  
  // Check if original starts with uppercase
  if (original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  
  return replacement;
}

function isEditable(el) {
  // Check for standard editable elements
  if (el.tagName === "TEXTAREA") return true;
  
  // Check for all text-based input types (including search bars)
  if (el.tagName === "INPUT") {
    const type = el.type ? el.type.toLowerCase() : "text";
    const editableTypes = ["text", "search", "email", "url", "tel", "password"];
    return editableTypes.includes(type);
  }
  
  // Check for contentEditable (includes Google Docs and rich text editors)
  if (el.contentEditable === "true" || el.isContentEditable) return true;
  
  // Check for elements with designMode (rare but used by some editors)
  if (el.ownerDocument && el.ownerDocument.designMode === "on") return true;
  
  return false;
}

// Translate word using free LLM API (Hugging Face)
async function translateWithLLM(word) {
  try {
    // Use Hugging Face's free inference API
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Translate this modern English word to medieval English. Modern: hello Medieval: hail Modern: you Medieval: thou Modern: ${word} Medieval:`,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      // Fallback to dictionary if API fails
      console.log('LLM API error, using dictionary fallback');
      const translation = getTranslation(word);
      return translation ? preserveCase(word, translation) : word;
    }

    const data = await response.json();
    if (data && data[0] && data[0].generated_text) {
      let result = data[0].generated_text.trim().split(/\s+/)[0];
      result = result.replace(/[^a-zA-Z'-]/g, '');
      return result ? preserveCase(word, result) : word;
    }
    
    // Fallback to dictionary
    const translation = getTranslation(word);
    return translation ? preserveCase(word, translation) : word;
  } catch (error) {
    console.log('LLM translation failed, using dictionary fallback');
    // Fallback to dictionary
    const translation = getTranslation(word);
    return translation ? preserveCase(word, translation) : word;
  }
}

// Handle input and textarea elements
function setupEventListeners(doc) {
  doc.addEventListener("input", async (e) => {
    if (isTransforming) return;

    const el = e.target;
    if (!isEditable(el)) return;
    
    // Check page permission (especially for Google Docs)
    const hasPermission = await checkPagePermission();
    if (!hasPermission) return;

    // Get current mode and enabled state from storage
    try {
      const result = await chrome.storage.local.get(["useLLM", "enabled"]);
      
      // Check enabled state from storage
      if (result.enabled === false) return;
    
      const useLLM = result.useLLM || false;

      // Handle standard input/textarea
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        handleStandardInput(el, useLLM);
      }
      // Handle contentEditable
      else if (el.contentEditable === "true" || el.isContentEditable) {
        handleContentEditable(el, useLLM);
      }
    } catch (error) {
      // Extension context invalidated - silently ignore
      return;
    }
  }, true); // Use capture phase to catch events from dynamically loaded elements

  // Also listen for keyup event for better compatibility with search inputs
  doc.addEventListener("keyup", async (e) => {
    if (isTransforming) return;
    
    // Only trigger on space key
    if (e.key !== " " && e.code !== "Space") return;

    const el = e.target;
    if (!isEditable(el)) return;
    
    // Check page permission (especially for Google Docs)
    const hasPermission = await checkPagePermission();
    if (!hasPermission) return;

    // Get current mode and enabled state from storage
    try {
      const result = await chrome.storage.local.get(["useLLM", "enabled"]);
      
      // Check enabled state from storage
      if (result.enabled === false) return;
    
      const useLLM = result.useLLM || false;

      // Handle standard input/textarea
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        handleStandardInput(el, useLLM);
      }
      // Handle contentEditable
      else if (el.contentEditable === "true" || el.isContentEditable) {
        handleContentEditable(el, useLLM);
      }
    } catch (error) {
      // Extension context invalidated - silently ignore
      return;
    }
  }, true);

  // Also listen for focus events to handle dynamically loaded elements
  doc.addEventListener("focus", async (e) => {
    const el = e.target;
    if (isEditable(el)) {
      // Just mark that this element is editable - actual transformation happens on input
      el.setAttribute("data-medieval-enabled", "true");
    }
  }, true);
}

// Setup listeners for main document
setupEventListeners(document);

// Handle iframes (like Google Docs)
function setupIframeListeners() {
  // Find all iframes and setup listeners
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      // Check if we can access the iframe (same-origin policy)
      if (iframe.contentDocument) {
        setupEventListeners(iframe.contentDocument);
      }
    } catch (e) {
      // Cross-origin iframe, cannot access
      console.log('Cannot access iframe (cross-origin)');
    }
  });
}

// Setup iframe listeners after a delay to catch dynamically loaded iframes
setTimeout(setupIframeListeners, 1000);
setTimeout(setupIframeListeners, 3000);
setTimeout(setupIframeListeners, 5000);

function handleStandardInput(el, useLLM) {
  isTransforming = true;

  const cursorPos = el.selectionStart;
  const textBeforeCursor = el.value.substring(0, cursorPos);
  const textAfterCursor = el.value.substring(cursorPos);
  
  // Find the last complete word before cursor
  const match = textBeforeCursor.match(/(\w+)(\s+)$/);
  
  if (match) {
    const lastWord = match[1];
    const whitespace = match[2];
    
    if (useLLM) {
      // Use LLM mode
      translateWithLLM(lastWord).then(replacement => {
        if (replacement && replacement !== lastWord) {
          const wordStart = textBeforeCursor.length - lastWord.length - whitespace.length;
          
          // Replace the word
          el.value = el.value.substring(0, wordStart) + replacement + whitespace + textAfterCursor;
          
          // Restore cursor position, accounting for length difference
          const newPos = cursorPos + (replacement.length - lastWord.length);
          el.setSelectionRange(newPos, newPos);
        }
        isTransforming = false;
      }).catch(() => {
        isTransforming = false;
      });
    } else {
      // Use dictionary mode
      const translation = getTranslation(lastWord);
      if (translation) {
        const replacement = preserveCase(lastWord, translation);
        const wordStart = textBeforeCursor.length - lastWord.length - whitespace.length;
        
        // Replace the word
        el.value = el.value.substring(0, wordStart) + replacement + whitespace + textAfterCursor;
        
        // Restore cursor position, accounting for length difference
        const newPos = cursorPos + (replacement.length - lastWord.length);
        el.setSelectionRange(newPos, newPos);
      }
      isTransforming = false;
    }
  } else {
    isTransforming = false;
  }
}

function handleContentEditable(el, useLLM) {
  isTransforming = true;

  // Get the correct window and document context (important for iframes like Google Docs)
  const doc = el.ownerDocument;
  const win = doc.defaultView || doc.parentWindow;
  const selection = win.getSelection();
  
  if (!selection || !selection.rangeCount) {
    isTransforming = false;
    return;
  }

  const range = selection.getRangeAt(0);
  let textNode = range.startContainer;
  
  // Handle case where cursor is in an element node, not a text node
  if (textNode.nodeType === Node.ELEMENT_NODE) {
    // Try to find the last text node in the element
    const walker = document.createTreeWalker(
      textNode,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let lastTextNode = null;
    while (walker.nextNode()) {
      lastTextNode = walker.currentNode;
    }
    if (lastTextNode) {
      textNode = lastTextNode;
    } else {
      isTransforming = false;
      return;
    }
  }
  
  if (textNode.nodeType !== Node.TEXT_NODE) {
    isTransforming = false;
    return;
  }

  const text = textNode.textContent;
  const cursorPos = range.startOffset;
  const textBeforeCursor = text.substring(0, cursorPos);
  
  // Find the last complete word before cursor
  const match = textBeforeCursor.match(/(\w+)(\s+)$/);
  
  if (match) {
    const lastWord = match[1];
    const whitespace = match[2];
    
    if (useLLM) {
      // Use LLM mode
      translateWithLLM(lastWord).then(replacement => {
        if (replacement && replacement !== lastWord) {
          const wordStart = textBeforeCursor.length - lastWord.length - whitespace.length;
          
          // Replace the word
          const newText = text.substring(0, wordStart) + replacement + whitespace + text.substring(cursorPos);
          textNode.textContent = newText;
          
          // Restore cursor position
          const newPos = cursorPos + (replacement.length - lastWord.length);
          try {
            range.setStart(textNode, newPos);
            range.setEnd(textNode, newPos);
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            // If range setting fails (can happen in complex editors), just continue
            console.log('Could not restore cursor position');
          }
        }
        isTransforming = false;
      }).catch(() => {
        isTransforming = false;
      });
    } else {
      // Use dictionary mode
      const translation = getTranslation(lastWord);
      if (translation) {
        const replacement = preserveCase(lastWord, translation);
        const wordStart = textBeforeCursor.length - lastWord.length - whitespace.length;
        
        // Replace the word
        const newText = text.substring(0, wordStart) + replacement + whitespace + text.substring(cursorPos);
        textNode.textContent = newText;
        
        // Restore cursor position
        const newPos = cursorPos + (replacement.length - lastWord.length);
        try {
          range.setStart(textNode, newPos);
          range.setEnd(textNode, newPos);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          // If range setting fails (can happen in complex editors), just continue
          console.log('Could not restore cursor position');
        }
      }
      isTransforming = false;
    }
  } else {
    isTransforming = false;
  }
}

// Both enabled and useLLM are now read directly from storage on each input event

// Observe DOM changes to handle dynamically loaded content (SPAs, infinite scroll, etc.)
const observer = new MutationObserver((mutations) => {
  // Check for new iframes
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeName === 'IFRAME') {
        setTimeout(() => {
          try {
            if (node.contentDocument) {
              setupEventListeners(node.contentDocument);
            }
          } catch (e) {
            // Cross-origin iframe
          }
        }, 100);
      }
      // Also check if the node contains iframes
      if (node.querySelectorAll) {
        const iframes = node.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          setTimeout(() => {
            try {
              if (iframe.contentDocument) {
                setupEventListeners(iframe.contentDocument);
              }
            } catch (e) {
              // Cross-origin iframe
            }
          }, 100);
        });
      }
    });
  });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
});