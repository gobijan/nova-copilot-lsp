/*~*~* REFRESH_TOKEN: 7bd50adbbfba08ffa3d1 *~*~*/
/***** UP TO DATE WITH NOVA: 10.6 *****/

// DO NOT CHANGE OR MOVE THE REFRESH TOKEN ABOVE.
// Nova Types uses it to determine if the types are up to date.

// Project: https://docs.nova.app/api-reference/
// Definitions by: Tommaso Negri <https://github.com/tommasongr>
// Minimum TypeScript Version: 3.3

/// https://docs.nova.app/extensions/#javascript-runtime

// This runs in an extension of Apple's JavaScriptCore, manually set libs

/// <reference no-default-lib="true"/>
/// <reference lib="es7" />

/// https://docs.nova.app/api-reference/assistants-registry/

type AssistantsRegistrySelector = string | string[] | { syntax: string }

/** The `AssistantsRegistry` class is used to register and invoke assistants, which can provide specific extension functionality within the editor. A shared instance of the class is always available as the `nova.assistants` environment property. */
interface AssistantsRegistry {
	/**
	 * Registers a color assistant, which can provide document color information to the editor’s color picker.
	 *
	 * The object provided should conform to the following interface:
	 * @example
	 * interface ColorAssistant {
	 *   provideColors(editor, context);
	 *   provideColorPresentations(color, editor, context);
	 * }
	 * @since 5.0
	 */
	registerColorAssistant(
		selector: AssistantsRegistrySelector,
		object: ColorAssistant
	): Disposable

	/**
	 * Registers a completion assistant, which can provide completion items to the editor’s autocomplete list.
	 *
	 * The object provided should conform to the following interface:
	 * @example
	 * interface CompletionAssistant {
	 *   provideCompletionItems(editor, context);
	 * }
	 */
	registerCompletionAssistant(
		selector: AssistantsRegistrySelector,
		object: CompletionAssistant,
		options?: {
			/**
			 * A [Charset](https://docs.nova.app/api-reference/charset) object that defines characters, other than *identifier* characters, which trigger completions to be requested (such as `.`, `:`, etc.)
			 * @since 3.0
			 */
			triggerChars?: Charset
		}
	): Disposable

	/**
	 * Registers an issue assistant, which can provide diagnostic issues to the editor.
	 *
	 * The object provided should conform to the following interface:
	 * @example
	 * interface IssueAssistant {
	 *   provideIssues(editor);
	 * }
	 */
	registerIssueAssistant(
		selector: AssistantsRegistrySelector,
		object: IssueAssistant,
		options?: {
			/**
			 * The event for which issues are requested.
			 *
			 * The `event` option for issue assistants provided at registration time can affect when the editor asks for issues from the assistant:
			 * - `"onChange"`: Issues are requested shortly after the user stops typing (this is the default)
			 * - `"onSave"`: Issues are requested after each time the document is saved
			 *
			 * Some issue assistants may be better suited to operating when the user saves a document as opposed to when the user `changes` a document. For best results, consider offering an option in an extension’s global or workspace configuration that allows this to be changed by the user.
			 */
			event?: "onChange" | "onSave"
		}
	): Disposable

	/**
	 * Registers a [Task Assistant](https://docs.nova.app/extensions/run-configurations/#defining-a-task-assistant), which can provide tasks to the IDE.
	 *
	 * The object provided should conform to the following interface:
	 * interface TaskAssistant {
	 *   provideTasks();
	 * }
	 * @since 2.0
	 */
	registerTaskAssistant(
		object: TaskAssistant,
		options?: {
			/** An identifier for the assistant, which can be passed to `nova.workspace.reloadTasks()` */
			identifier?: string

			/** A user-readable name for the assistant displayed above its tasks */
			name?: string
		}
	): Disposable
}

type AssistantArray<T> = ReadonlyArray<T> | Promise<ReadonlyArray<T>>

/** @since 5.0 */
interface ColorAssistant {
	/**
	 * This method requests document color information for an editor.
	 *
	 * The `provideColors` method of the assistant should take as an argument the [TextEditor](https://docs.nova.app/api-reference/text-editor) instance requesting color information, and a [ColorInformationContext](https://docs.nova.app/api-reference/color-information-context) providing contextual information, and then return an array of [ColorInformation](https://docs.nova.app/api-reference/color-information) objects, or a `Promise` resolving to such.
	 */
	provideColors(editor: TextEditor, context: ColorInformationContext): AssistantArray<ColorInformation>

	/**
	 * This method requests color presentations for a color object.
	 *
	 * The `provideColorPresentations` method of the assistant should take as an argument the [Color](https://docs.nova.app/api-reference/color) instance being transformed, the [TextEditor](https://docs.nova.app/api-reference/text-editor) instance that is requesting presentations, and a [ColorPresentationContext](https://docs.nova.app/api-reference/color-presentation-context) providing contextual information, and then return an array of [ColorPresentation](https://docs.nova.app/api-reference/color-presentation) objects, or a `Promise` resolving to such.
	 *
	 * An assistant may return one or more color presentation objects for the color to represent different “formats” the color may be represented as, such as the various color functions in CSS (`rgb()`, `rgba()`, `hsl()`, etc.).
	 */
	provideColorPresentations(color: Color, editor: TextEditor, context: ColorPresentationContext): AssistantArray<ColorPresentation>
}

interface CompletionAssistant {
	/**
	 * The `provideCompletionItems` method of the assistant should take as an argument the [TextEditor](https://docs.nova.app/api-reference/text-editor) instance requesting completion, and a [CompletionContext](https://docs.nova.app/api-reference/completion-context) object.
	 *
	 * This method should return an array of the following object types, or a `Promise` resolving to such:
	 * - [CompletionItem](https://docs.nova.app/api-reference/completion-item): A completions item that can be inserted into the editor.
	 * - [CompletionColorPop](https://docs.nova.app/api-reference/completion-color-pop): A color pop that can be displayed to mix and choose colors.
	 */
	provideCompletionItems(editor: TextEditor, context: CompletionContext): AssistantArray<CompletionItem | CompletionColorPop>
}

interface IssueAssistant {
	/** The `provideIssues` method of the assistant should take as an argument the [TextEditor](https://docs.nova.app/api-reference/text-editor) instance requesting completion and return an array of [Issue](https://docs.nova.app/api-reference/issue) objects, or a `Promise` resolving to such. */
	provideIssues(editor: TextEditor): AssistantArray<Issue>
}

/** @since 2.0 */
interface TaskAssistant {
	/** The `provideTasks` method of the assistant should return an array of [Task](https://docs.nova.app/api-reference/task) objects. */
	provideTasks(): AssistantArray<Task>

	/**
	 * Invoked when a [TaskResolvableAction](https://docs.nova.app/api-reference/task-resolvable-action) is run by the user to provide the actual action that should be invoked.
	 *
	 * The context parameter is an instance of the [TaskActionResolveContext](https://docs.nova.app/api-reference/task-action-resolve-context) class, and provides contextual information about the action being resolved.
	 *
	 * This method should return a more concrete instance of a task action (such as a [TaskProcessAction](https://docs.nova.app/api-reference/task-process-action), which will be invoked as if it had been provided when the task was created. This method may also return a `Promise` that resolves to such an action.
	 *
	 * Returning `null`, `undefined`, or another instance of a resolvable action will cause the task invocation to fail.
	 * @since 4.0
	 */
	resolveTaskAction?<T extends Transferrable>(
		context: TaskActionResolveContext<T>
	): ResolvedTaskAction | Promise<ResolvedTaskAction>
}

/// https://docs.nova.app/api-reference/charset/

/**
 * A `Charset` object represents a set of Unicode characters that can be used with Scanner objects to parse strings for specific ranges of a string that match the characters in the charset.
 *
 * The `Charset` class is not subclassable.
 */
declare class Charset {
	/** Creates a new `Charset` object that contains all of the characters present in the provided string (or, if no string is provided, no characters). */
	constructor(characters?: string)

	/** The character set containing all alphanumeric characters, as defined in Unicode General Category L*, M*, and N*. */
	static alphanumeric: Charset

	/** The character set containing all decimal digit characters, as defined in Unicode Category Decimal Numbers. */
	static digits: Charset

	/** The character set containing all letter characters, as defined in Unicode General Category L* & M*. */
	static letters: Charset

	/** The character set containing all lowercase letter characters, as defined in Unicode General Category Ll. */
	static lower: Charset

	/** The character set containing all newline characters (U+000A ~ U+000D, U+0085, U+2028, and U+2029). */
	static newlines: Charset

	/** The character set containing all symbol characters, as defined in Unicode General Category S*. */
	static symbols: Charset

	/** The character set containing all uppercase letter characters, as defined in Unicode General Category Lu and Lt. */
	static upper: Charset

	/** The character set containing all whitespace characters, as defined in Unicode General Category Zs and CHARACTER TABULATION (U+0009). */
	static whitespace: Charset

	/** The character set containing all whitespace and newline characters, as defined in Unicode General Category Z*, U+000A ~ U+000D, and U+0085. */
	static whitespaceAndNewlines: Charset

	/** Returns a new character set that concatenates all characters in the receiver as well as any other charsets provided as arguments. */
	concat(...charsets: Charset[]): Charset

	/** Returns a new character set that forms an intersection of the receiver as well as any other charsets provided as arguments. */
	intersect(...charsets: Charset[]): Charset

	/** Returns a new character set that represents the inverse of the receiver. */
	invert(): Charset
}

/// https://docs.nova.app/api-reference/clipboard/

interface Clipboard {
	/** Returns a `Promise` object that resolves to the current text on the user’s clipboard. If the data on the clipboard is not text, or there is no data on the clipboard, the promise resolves to an empty string. */
	readText(): Promise<string>
	/** Writes text to the user’s pasteboard, replacing its contents. Returns a `Promise` that resolves when writing is complete. */
	writeText(text: string): Promise<void>
}

/// https://docs.nova.app/api-reference/color/

/** @since 3.0 */
enum ColorFormat {
	/** sRGB color space, 3-component RGB format */
	rgb = "rgb",

	/** sRGB color space, 3-component HSL format */
	hsl = "hsl",

	/** sRGB color space, 3-component HSB format */
	hsb = "hsb",

	/** Display P3 color space, 3-component RGB format */
	displayP3 = "p3",
}

type ColorComponents = [number, number, number, number?]

/**
 * A `Color` object represents a color that can be displayed to the user.
 *
 * The `Color` class is not subclassable.
 * @example
 * let color = new Color(ColorFormat.rgb, [1, 0, 0.5, 1]);
 *
 * color.format == ColorFormat.rgb ==> true;
 *
 * let red = color.components[0];
 * let green = color.components[1];
 * let blue = color.components[2];
 * let alpha = color.components[3];
 */
declare class Color {
	/**
	 * Creates a new `Color` object in a supported format using the provided components. The components must be an array of numbers, and contain only as many components as required by the format chosen.
	 *
	 * Currently, all formats supported require at least 3 components, and most support up to 4 (three color values and an alpha value).
	 * @throws An attempt to create a color object with the incorrect number of components will raise an `Error`.
	 */
	constructor(format: ColorFormat, components: ColorComponents)

	/** The format of the color, as a string. */
	readonly format: ColorFormat

	/** The array of component numbers for the color. */
	readonly components: ColorComponents

	/**
	 * Creates a new color using the RGB format and sRGB color space, with an optional alpha value. If the alpha value is not specified, 1.0 will be used.
	 * @since 3.0
	 */
	static rgb(red: number, green: number, blue: number, alpha: number = 1.0): Color

	/**
	 * Creates a new color using the HSL format and sRGB color space, with an optional alpha value. If the alpha value is not specified, 1.0 will be used.
	 * @since 3.0
	 */
	static hsl(hue: number, saturation: number, luminance: number, alpha: number = 1.0): Color

	/**
	 * Creates a new color using the HSB format and sRGB color space, with an optional alpha value. If the alpha value is not specified, 1.0 will be used.
	 * @since 3.0
	 */
	static hsb(hue: number, saturation: number, brightness: number, alpha: number = 1.0): Color

	/**
	 * Creates a new color using the Display P3 format and color space, with an optional alpha value. If the alpha value is not specified, 1.0 will be used.
	 * @since 3.0
	 */
	static displayP3(red: number, green: number, blue: number, alpha: number = 1.0): Color

	/** Converts the receiver into a different color format, returning a new `Color` object. */
	convert(format: ColorFormat): Color
}

/// https://docs.nova.app/api-reference/color-candidate/

/**
 * A `ColorCandidate` object represents a range of text within a document that could possibly be parsed into a [ColorInformation](https://docs.nova.app/api-reference/color-information) object to provide live color annotations in an editor.
 *
 * Color candidates can be automatically parsed from a document for any syntax tree nodes which utilize the `value.color` selector classes. Color assistants may then use these candidates for quicker parsing of [ColorInformation](https://docs.nova.app/api-reference/color-information) objects, as opposed to parsing the entire contents of the editor.
 *
 * The `ColorCandidate` class is not subclassable.
 * @since 5.0
 */
interface ColorCandidate {
	/** The range of the document where the color exists, as a [Range](https://docs.nova.app/api-reference/range) object. */
	range: Range
	// TODO: Check for undefined

	/** The textual contents of the document at the candidate’s range as a `String`. */
	text: string
	// TODO: Check if it is settable since undocumented
	// TODO: Check for undefined
}

/// https://docs.nova.app/api-reference/color-information/

/**
 * A `ColorInformation` object represents an instance of a [Color](https://docs.nova.app/api-reference/color) within a document, and defines the text range at which the color is located.
 *
 * The `ColorInformation` class is not subclassable.
 * @since 5.0
 * @example
 * let color = new Color(ColorFormat.rgb, [1, 0, 0.5, 1]);
 * let range = new Range(100, 107);
 * let colorInfo = new ColorInformation(range, color, "hex");
 */
declare class ColorInformation {
	/**
	 * Creates a new `ColorInformation` object with the provided [Range](https://docs.nova.app/api-reference/range) and [Color](https://docs.nova.app/api-reference/color) values.
	 *
	 * The optional `kind` argument should be a string that represents the “type” of color presentation the created color information object represents.
	 */
	constructor(range: Range, color: Color, kind?: string)

	/** The color represented by the object as a [Color](https://docs.nova.app/api-reference/color) object. */
	color: Color

	/**
	 * The presentation kind that by which the color information is represented.
	 *
	 * This value will be used by the editor color picker to automatically select the first [ColorPresentation](https://docs.nova.app/api-reference/color-presentation) object returned from the relevant color assistant that matches this `kind`. This way, as a user alters the value of a color, the text presentation of the new color can be consistent. If this value is not provided, then no attempt to match presentation kinds will be attempted.
	 */
	kind?: string

	/** The range of the document where the color exists, as a [Range](https://docs.nova.app/api-reference/range) object. */
	range: Range

	/** A boolean value indicating whether the color information uses floating-point values for its components (not including alpha), such as an RGB presentation that uses floating point values between `0.0` and `1.0`. This property may be provided as a hint as to which editing controls should be displayed when the color information is chosen. If not provided, it is assumed this value is `false`. */
	usesFloats?: boolean
}

/// https://docs.nova.app/api-reference/color-information-context/

/**
 * A `ColorInformationContext` object contains contextual information about a request to provide a set of [ColorInformation](https://docs.nova.app/api-reference/color-information) for a [TextEditor](https://docs.nova.app/api-reference/text-editor). A color information context is provided as part of an invocation of the `provideColors(editor, context)` for a color assistant.
 *
 * The `ColorInformationContext` class is not subclassable.
 * @since 5.0
 */
interface ColorInformationContext {
	/**
	 * An array of [ColorCandidate](https://docs.nova.app/api-reference/color-candidate) objects representing *possible* colors in the document based on the available syntax grammar.
	 *
	 * These candidates, if available, are automatically parsed from the document for any syntax tree nodes using the `value.color` selector classes. Color assistants may use these values for quicker parsing of color values as opposed to parsing the entire contents of the editor.
	 *
	 * If no color information could be parsed from the syntax tree, this property will be an empty array.
	 */
	readonly candidates: ReadonlyArray<ColorCandidate>
}

/// https://docs.nova.app/api-reference/color-presentation/

/**
 * A `ColorPresentation` object represents a single way a [Color](https://docs.nova.app/api-reference/color) object can be represented in the text of a document. Examples of this include the various CSS color types (#HEX, rgb(), rgba(), etc.).
 *
 * The `ColorPresentation` class is not subclassable.
 * @since 5.0
 * @example
 * let string = "#000000";
 * let presentation = new ColorPresentation(string, "hex");
 */
declare class ColorPresentation {
	/**
	 * Creates a new `ColorPresentation` object with the provided label string.
	 *
	 * The optional `kind` argument may be a string that represents the “type” of the color presentation. This value will be used by a color picker to automatically select the most consistent representation based on any existing color at the relevant location when performing color mixing. This string is arbitrary and can be decided by the extension.
	 */
	constructor(label: string, kind?: string)

	/** An array of [TextEdit](https://docs.nova.app/api-reference/text-edit) objects describing additional changes to apply to the editor when this presentation is chosen, unrelated to the change made via the `textEdit` or `label` properties. The ranges of these edits must not intersect each other nor the current editor selection. */
	additionalTextEdits?: TextEdit[]

	/** The closest [Color Format](https://docs.nova.app/api-reference/color/#formats) for which the provided color presentation represents. This property may be provided as a hint as to which editing controls should be displayed when the presentation is chosen. If not provided, the color picker will attempt to interpret to the best of its ability. */
	format?: ColorFormat

	/** The text used when inserting the presentation into the editor. If not specified, `label` will be used. */
	insertText?: string

	/**
	 * The presentation kind may be a string that represents the “type” of the color presentation.
	 *
	 * This value will be used by a color picker to automatically select the most consistent representation based on any existing color at the relevant location when performing color mixing. This string is arbitrary and can be decided by the extension.
	 */
	kind?: string

	/** The user-readable label for the presentation. This will be displayed in the color picker’s presentations list. */
	label: string

	/**
	A boolean value indicating whether the presentation uses floating-point values for its components (not including alpha), such as an RGB presentation that uses floating point values between `0.0` and `1.0`. This property may be provided as a hint as to which editing controls should be displayed when the presentation is chosen. If not provided, it is assumed this value is `false`. */
	usesFloats?: boolean
}

/// https://docs.nova.app/api-reference/color-presentation-context/

/**
 * A `ColorPresentationContext` object contains contextual information about a request to provide a set of [ColorPresentation](https://docs.nova.app/api-reference/color-presentation) for a [Color](https://docs.nova.app/api-reference/color) object. A color presentation context is provided as part of an invocation of the `provideColorPresentations(color, editor, context)` for a color assistant.
 *
 * The `ColorPresentationContext` class is not subclassable.
 * @since 5.0
 */
interface ColorPresentationContext {
	/** The range of text within the editor into which a presentation will be inserted if accepted by the user, as a [Range](https://docs.nova.app/api-reference/range). This value may be used to compute a [TextEdit](https://docs.nova.app/api-reference/text-edit) object to assign to a color presentation. */
	readonly range: Range
}

/// https://docs.nova.app/api-reference/commands-registry/

type Transferrable =
| Transferrable[]
| ReadonlyArray<Transferrable>
| Date
| null
| number
| { [key: string]: Transferrable }
| RegExp
| string
| Color
| Range

/** The `CommandsRegistry` class is used to register and invoke extension commands. A shared instance of the class is always available as the `nova.commands` environment property. */
interface CommandsRegistry {
	/**
	 * Registers a command with the registry, making it available for binding to command palette and menu items declared in the extension’s `extension.json` file.
	 *
	 * If the command should be user-visible, the `name` argument should match a command declared in the [extension manifest](https://docs.nova.app/extensions/commands/#defining-a-command).
	 *
	 * The `callable` will be invoked with a different first argument depending on the category / context in which the command is defined:
	 * - Commands that are present in the Editor menu (using the `editor` [commands category](https://docs.nova.app/extensions/commands/#defining-a-command)) will receive the focused [TextEditor](https://docs.nova.app/api-reference/text-editor) object
	 * - Commands appearing in all other categories will receive the current [Workspace](https://docs.nova.app/api-reference/workspace) object
	 * - Commands that are not defined in the manifest will receive the current [Workspace](https://docs.nova.app/api-reference/workspace) object
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	register<T>(name: string, callable: (this: T, ...params: any[]) => void, thisValue?: T): Disposable

	/**
	 * Invokes the command registered for a given name, if any.
	 *
	 * The command’s callback will be invoked as if the user had chosen it from the Extensions menu (or command palette).
	 *
	 * The first argument the command’s callback receives will be the current [Workspace](https://docs.nova.app/api-reference/workspace). Additional arguments provided to this method will be delivered to the command after this workspace argument, assuming they are [valid to be transferred to the command](https://docs.nova.app/api-reference/commands-registry/#supported-types-for-arguments).
	 *
	 * This method returns a `Promise` object that resolves to the result of invoking the command. If no command is registered for the name, the promise will be rejected with an error.
	 */
	invoke(name: string, ...arguments: Transferrable[]): Promise<unknown>
}

/// https://docs.nova.app/api-reference/completion-color-pop/

/**
 * A `CompletionColorPop` object defines a color pop. By creating and returning a color pop object as part of the completions, an extension indicates that a color pop should be offered to the user to mix and choose colors.
 *
 * The `CompletionColorPop` class is not subclassable.
 * @since 5.0
 */
declare class CompletionColorPop {
	/** Creates a new color pop. Color pops do not currently have any further properties or options. */
	constructor()
}

/// https://docs.nova.app/api-reference/completion-context/

declare enum CompletionReason {
	/** Completion was triggered direct by the user, such as by hitting the escape key. */
	Invoke,

	/** Completion was triggered by the user typing a character. */
	Character
}

/** A `CompletionContext` object defines information about the request for completion items within an editor. A completion context is used when building [CompletionItem](https://docs.nova.app/api-reference/completion-item) objects. */
interface CompletionContext {
	/** The word immediately proceeding the cursor, or an empty string if no word exists. The cursor will be positioned directly after the last character in this string. */
	readonly text: string

	/** The text of the entire line preceding the cursor, not including indentation whitespace. The cursor will be positioned directly after the last character in this string. */
	readonly line: string

	/**
	 * A [Charset](https://docs.nova.app/api-reference/charset) object defining the set of identifier characters valid for the syntax used for the completion request. This represents the set of characters that are normally valid for automatically invoking completion requests.
	 * @since 3.0
	 */
	readonly identifierChars: Charset

	/** The character position of the cursor within the requesting text editor, as a number. */
	readonly position: number

	/** The reason the completion was triggered, as a value from the `CompletionReason` enumeration. */
	readonly reason: CompletionReason

	/** An array of [ScopeSelector](https://docs.nova.app/api-reference/scope-selector) objects that reflect the tree of syntax grammar selectors for the completion position. The array will be ordered depth, with deepest first, where the first item in the array is the syntax scope encompassing the completion position, the next item is its ancestor, onwards to the final item which represents the root of the tree. */
	readonly selectors: ReadonlyArray<ScopeSelector>

	/**
	 * The character that triggered the completion request as a `String`. If the request was not triggered by a character (such as if the `reason` is `Invoke`), this will return `null` or `undefined`.
	 * @since 3.0
	 */
	readonly triggerCharacter?: string | null
}

/// https://docs.nova.app/api-reference/completion-item/

/**
 * A `CompletionItem` object defines a single item displayed in the editor completions (autocomplete) list. Items define what happens when the user selects the item, such as replacing text at the cursor position and invoking an extension command.
 *
 * The `CompletionItem` class is not subclassable.
 */
declare class CompletionItem {
	/**
	 * Creates a new completion item.
	 * @example
	 * let item = new CompletionItem("foobar()", CompletionItemKind.Function);
	 *
	 * item.documentation = "Performs the foobar request.";
	 * item.insertText = "foobar(${0:args})";
	 * item.insertTextFormat = InsertTextFormat.Snippet;
	 */
	constructor(label: string, kind: CompletionItemKind)

	/**
	 * An array of [TextEdit](https://docs.nova.app/api-reference/text-edit) objects describing additional changes to apply to the editor when this item is chosen, unrelated to the change made to the completion position. The ranges of these edits must not intersect each other nor the `range` of the completion item’s primary edit.
	 * @since 2.0
	 */
	additionalTextEdits?: TextEdit[]

	/**
	 * A [Color](https://docs.nova.app/api-reference/color) object to display as a swatch in place of a symbol icon, if the item’s kind is set to `Color`.
	 * @since 1.2
	 */
	color?: Color

	/** A [Charset](https://docs.nova.app/api-reference/charset) object that specify the character set that, if typed while the item is highlighted, will accept the completion before inserting the typed character. */
	commitChars?: Charset

	/** An additional label for the item that is displayed alongside it, such as its type name. */
	detail?: string

	/** A user-visible documentation string displayed at the bottom of the completions panel when the item is highlighted. */
	documentation?: string

	/** The text used when filtering the item. If not specified, `label` will be used. */
	filterText?: string

	/** The text used when inserting the item into the editor. If not specified, `label` will be used. */
	insertText?: string

	/**
	 * The format used when inserting the item’s `insertText`, specified using the `InsertTextFormat` enum.
	 * @since 1.2
	 */
	insertTextFormat?: InsertTextFormat

	/** The kind of item, specified using the `CompletionItemKind` enum, which affects things such as the icon displayed beside the item, such as `CompletionItemKind.Function`. */
	readonly kind: CompletionItemKind

	/** The user-visible name of the item in the completions list. By default, this is the text that is also inserted into the editor when the item is chosen. */
	readonly label: string

	/**
	 * If the item’s kind is `CompletionItemKind.File` and this property is set to a file path, the file’s icon will be used for the completion item (as long as the `image` is not also set).
	 *
	 * Additionally, the file path may be shown beside the completion item to indicate the full path it represents (if, for example, the item’s name is just the file or module name).
	 * @since 7.0
	 */
	path?: string

	/** A [Range](https://docs.nova.app/api-reference/range) value that describes the textual range within the editor that should be replaced when the item is chosen. If not specified, the word preceeding the cursor will be replaced. */
	range?: Range

	/**
	 * **This property is deprecated as of Nova 1.2. Consider using the insertTextFormat property instead.**
	 *
	 * Whether the text inserted by the completion should parsed for a special tokenization format.
	 *
	 * If `true`, then occurrences of the format `$[value]` (a name surrounded by brackets and prefixed with a dollar sign) will be replaced by editor tokens containing the name `value`, where `value` may be any string that contains any characters other than `$`, `[` and `]`. By default this property is false.
	 *
	 * For backwards compatibility, settings this value to `true` will modify the `insertTextFormat` to a private value representing this format. This format may not be used alongside other insertion formats and its use is discouraged going forward.
	 * @deprecated since 1.2
	 */
	tokenize?: boolean
}

declare enum CompletionItemKind {
	// Types

	/** A generic object type or metatype. */
	Type,
	/** An object class type. */
	Class,
	/** An extension to a type. */
	Category,
	/** An interface of type conformance. */
	Interface,
	/** An enumeration of values. */
	Enum,
	/** A union of types. */
	Union,
	/** A simple type structure. */
	Struct,

	// Types

	/** A self-contained callable. */
	Function,
	/** A callable member of an object. */
	Method,
	/** A self-contained closure. */
	Closure,
	/** An object type constructor. */
	Constructor,
	/**
	 * An object type destructor.
	 * @since 4.0
	 */
	Destructor,
	/** An object property getter. */
	Getter,
	/** An object property setter. */
	Setter,
	/**
	 * A static callable member of a type.
	 * @since 4.0
	 */
	StaticMethod,

	// Values

	/** A non-modifyable value. */
	Constant,
	/** A modifyable value. */
	Variable,
	/** An object property value. */
	Property,
	/** An argument passed to a callable. */
	Argument,
	/** A color value. */
	Color,
	/** A member value of an enumeration. */
	EnumMember,
	/**
	 * A static type property value.
	 * @since 4.0
	 */
	StaticProperty,

	// Expressions

	/** An inline expression. */
	Expression,
	/** An inline statement. */
	Statement,
	/** A logical code package. */
	Package,
	/** A referenced document. */
	File,
	/** An external reference. */
	Reference,
	/** A syntactic keyword. */
	Keyword,

	// StyleSheets

	/** A set of rules, such as CSS attributes. */
	StyleRuleset,
	/** A set of directives, such as a CSS @at-rule. */
	StyleDirective,
	/** A style ID selector. */
	StyleID,
	/** A style class selector. */
	StyleClass,
	/**
	 * A style pseudo-class selector.
	 * @since 4.0
	 */
	StylePseudoClass,
	/**
	 * A style pseudo-element selector.
	 * @since 4.0
	 */
	StylePseudoElement,

	// Tags

	/** A generic markup tag. */
	Tag,
	/**
	 * A document head (metadata) tag.
	 * @since 4.0
	 */
	TagHead,
	/**
	 * A document title tag.
	 * @since 4.0
	 */
	TagTitle,
	/**
	 * A document metadata item tag.
	 * @since 4.0
	 */
	TagMeta,
	/**
	 * An external resource reference tag (link).
	 * @since 4.0
	 */
	TagLink,
	/**
	 * A document body tag.
	 * @since 4.0
	 */
	TagBody,
	/**
	 * An scripting reference tag.
	 * @since 4.0
	 */
	TagScript,
	/**
	 * A styleset reference tag.
	 * @since 4.0
	 */
	TagStyle,
	/**
	 * A heading tag (h1, etc.).
	 * @since 4.0
	 */
	TagHeading,
	/**
	 * A section tag (section, nav, etc.).
	 * @since 4.0
	 */
	TagSection,
	/**
	 * A generic container tag (div, span).
	 * @since 4.0
	 */
	TagContainer,
	/**
	 * An unordered list tag.
	 * @since 4.0
	 */
	TagUnorderedList,
	/**
	 * An ordered list tag.
	 * @since 4.0
	 */
	TagOrderedList,
	/**
	 * A list item tag.
	 * @since 4.0
	 */
	TagListItem,
	/**
	 * An external resource anchor tag (a).
	 * @since 4.0
	 */
	TagAnchor,
	/**
	 * An external image reference tag (img).
	 * @since 4.0
	 */
	TagImage,
	/**
	 * An external media asset reference tag (audio, etc.).
	 * @since 4.0
	 */
	TagMedia,
	/**
	 * A form tag.
	 * @since 4.0
	 */
	TagForm,
	/**
	 * A form field tag.
	 * @since 4.0
	 */
	TagFormField,
	/**
	 * A framework tag (PHP, etc).
	 * @since 4.0
	 */
	TagFramework,
}

declare enum InsertTextFormat {
	/** Inserts as plain text. This is the default. */
	PlainText,

	/** Inserts text using the [Snippets](https://docs.nova.app/extensions/snippets) format. Snippet placeholders will be resolved into editor tokens. */
	Snippet,
}

/// https://docs.nova.app/api-reference/composite-disposable/

/**
 * A `CompositeDisposable` collects together multiple [Disposable](https://docs.nova.app/api-reference/disposable) objects, ensuring that when the composite is disposed, the objects contained therein are also disposed appropriately.
 *
 * The `CompositeDisposable` class is not subclassable.
 * @implements {Disposable}
 */
interface CompositeDisposable extends Disposable {
	/** Adds an object to the receiver, which will receive a call to `dispose()` when the composite object is disposed. Calling this method multiple times with the same object will only add it once. If the composite has already been disposed, this effectively does nothing. */
	add(object: Disposable): void

	/** Removes an object from the receiver, so that it will not receive a call to `dispose()` when the composite is disposed. If the composite has already been disposed, this effectively does nothing. */
	remove(object: Disposable): void

	/** An alias for `remove()`. */
	delete(object: Disposable): void

	/** Removes all objects from the receiver, so that they will not receive a call to `dispose()` when the composite is disposed. If the composite has already been disposed, this effectively does nothing. */
	clear(): void
}

/// https://docs.nova.app/api-reference/configuration/

type ConfigurationValue = string | number | boolean | string[]

/**
 * A `Configuration` is a key-value storage that can be persistently saved on disk. Configurations are provided by the extension API for the user’s global preferences (see [Environment](https://docs.nova.app/api-reference/environment)) and [Workspace](https://docs.nova.app/api-reference/workspace) preferences.
 *
 * Keys in a configuration can optionally have a default value set by either the application or an extension. In this case, calls to `get` for a configuration that does not have an explicit value set will return the default value.
 */
interface Configuration {
	/**
	 * Adds an event listener that invokes the provided `callback` when a specific configuration key is changed. The callback will receive the new and old values of the key.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidChange<T, V>(key: string, callback: (this: T, newValue: V, oldValue: V) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when a specific configuration key is changed. The callback will receive the new and old values of the key. Similar to `onDidChange()`, except that this method immediate invokes the callback with the current value of the key. Returns a [Disposable](https://docs.nova.app/api-reference/disposable) object that can be used to cancel the event listener.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	observe<T, V>(key: string, callback: (this: T, newValue: V, oldValue: V) => void, thisValue?: T): Disposable

	/**
	 * Gets the current value of a key in the configuration. Returns null if no value and no default is set.
	 *
	 * If the optional `coerce` argument is provided, the value can be automatically coerced to ensure a specific type. The following coercion types are supported:
	 * - “string”: ensures that the value is a String, otherwise returning `null`
	 * - “number”: ensures that the value is a Number, otherwise returning `null`
	 * - “array”: ensures that the value is an Array of String, otherwise returning `null`
	 * - “boolean”: ensures that the value is a Boolean, otherwise returning `null`
	 */
	get(key: string): ConfigurationValue | null
	get(key: string, coerce: "string"): string | null
	get(key: string, coerce: "number"): number | null
	get(key: string, coerce: "array"): string[] | null
	get(key: string, coerce: "boolean"): boolean | null

	/**
	 * Sets the value of the provided key in the configuration. If `value` is `undefined`, this will effectively remove the key from the configuration, returning it to its default value (if any).
	 *
	 * @throws This method will throw an `Error` if the provided value is not a `String`, `Number`, `Boolean`, `Array` of `String`, `null`, or `undefined`.
	 */
	set(key: string, value?: ConfigurationValue | null): void

	/** Removes the value for the provided key in the configuration, returning it to its default value (if any). This is effectively the same as passing `undefined` to the `.set()` method. */
	remove(key: string): void
}

/// https://docs.nova.app/api-reference/console/

/** The `Console`, like its browser counterpart, exposes API related to logging information to the built-in extension console. An instance is always available via the `console` global object. */
interface Console {
	/** Asserts that an expression evaluates to `true`. If additional arguments are provided, they will be formatted as arguments in the same way as `log()`.
	 * @throws If not, the provided `message` will be used to raise an `Error`.
	 */
	assert(condition: () => unknown, message: string, ...params: unknown[]): void

	/** Clears all console messages dispatched from the current extension. */
	clear(): void

	/** Logs the provided `message` to the console. If additional arguments are provided, they will be used as substring formatting for the message using JavaScript substring semantics. */
	log(message: unknown, ...params: unknown[]): void

	/** Logs an informative message to the console. Informative messages are of a lower priority than standard log messages, warnings, or errors, and will never alert the user in any way. This method otherwise behaves very similarly to `log()`. */
	info(message: unknown, ...params: unknown[]): void

	/** Logs a warning message to the console. Warning messages are of a higher priority than standard log messages, but lower priority than errors, and may alert the user in some way. They should be used to indicate that an operation encountered an unexpected state, but can safely continue. This method otherwise behaves very similarly to `log()`. */
	warn(message: unknown, ...params: unknown[]): void

	/** Logs an error message to the console. Error messages are of the highest priority in the console, and may alert the user in some way. They should be used to indicate that an operation encountered an unexpected state and cannot continue. This method otherwise behaves very similarly to `log()`. */
	error(message: unknown, ...params: unknown[]): void

	/** Begins a logging group. Multiple calls to this method will increase the nested group level by one, and should be balanced by an equal number of calls to `groupEnd()`. */
	group(): void

	/** Ends the deepest nested logging group. Calls to `group()` must be balanced by an equal number of calls to this method. */
	groupEnd(): void

	/** Logs the number of times this method has been invoked with the provided label. If no label is provided, this method will log the number of times it has been invoked at the current line. */
	count(label?: string): void

	/** Starts a timer with a provided label. When a call to `timeEnd()` is made using the same label, the total elapsed duration of the timer in milliseconds will be logged to the console. */
	time(label: string): void

	/** Ends the timer with a provided label, logging the total elapsed duration of the timer in milliseconds to the console. */
	timeEnd(label: string): void

	/** Logs the current elapsed duration of a timer with the provided label to the console, without ending the timer. If no label is provided, this method will log the current elapsed duration of all running timers. */
	timeStamp(label?: string): void

	/** Outputs a stack trace to the console. */
	trace(): void
}

declare const console: Console

/// https://docs.nova.app/api-reference/credentials/

type User = unknown

interface Credentials {
	/**
	 * Retrieves a password for a given service and user, returning a `String`, or `null` if no password was found.
	 * @throws Will raise an `Error` if communication with the Keychain API fails.
	 */
	getPassword(service: string, user: User): string | null

	/**
	 * Sets a password for a given service and user. The password must be a `String` value.
	 * @throws Will raise an `Error` if communication with the Keychain API fails.
	 */
	setPassword(service: string, user: User, password: string): null

	/**
	 * Removes a password for a given service and user.
	 * @throws Will raise an `Error` if communication with the Keychain API fails.
	 */
	removePassword(service: string, user: User): null
}

/// https://docs.nova.app/api-reference/crypto/

type IntegerTypedArray =
| Int8Array
| Uint8Array
| Uint8ClampedArray
| Int16Array
| Uint16Array
| Int32Array
| Uint32Array
// | BigInt64Array
// | BigUint64Array
// TODO: Int64 arrays are not resolved

/**
 * The `nova.crypto` global object is used to generate cryptographic primitives for use in secure operations.
 * @since 10.0
 */
interface Crypto {
	/** Fills the provided [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) with cryptographically-sound random values. The provided array should be one of the JavaScript integer-based typed arrays, such as `Int8Array`, `Uint8Array`, `Int16Array`, etc. All elements of the array will be overwritten. This method returns the same array instance as was passed as an argument. */
	getRandomValues<T extends IntegerTypedArray>(typedArray: T): T

	/** Returns a randomly generated, 36-character UUID v4 identifier string. */
	randomUUID(): string
}

/// https://docs.nova.app/api-reference/debug-session/

/**
 * A `DebugSession` object represents a single debug session running in tandem with an [adapter](https://docs.nova.app/extensions/debug-adapters) conforming to the [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/). Instances of this class can be used to send custom requests to and receive custom events from the adapter.
 *
 * The target of a debug session (or the *debuggee*) can be many things, such as an external process, a web page running within a browser, or a script running on a remote host.
 *
 * Debug sessions are started by providing a [TaskDebugAdapterAction](https://docs.nova.app/api-reference/task-debug-adapter-action) object when resolving an action via the [Tasks API](https://docs.nova.app/extensions/run-configurations).
 *
 * Debug session objects can be received from the [Workspace](https://docs.nova.app/api-reference/workspace) via the `debugSessions` property or the `onDidStartDebugSession()` and `onDidEndDebugSession()` methods.
 *
 * The `DebugSession` class is not subclassable.
 * @since 9.0
 */
interface DebugSession {
	/** The identifier of the debug session. Each session has an identifier that is unique to the workspace. Since multiple sessions may be started for a single debug adapter this value is not the same as the debug adapter’s identifier. */
	readonly identifier: string

	/** The user-readable name for the debug session as determined by the task invoked by the user to start the session. */
	readonly name: string

	/** The type string of the debug adapter coordinating the session. This value is the same as the `adapterType` argument provided when creating a [TaskDebugAdapterAction](https://docs.nova.app/api-reference/task-debug-adapter-action) object. */
	readonly type: string

	/**
	 * Adds an event listener that invokes the provided `callback` when a custom event is received from the adapter. The callback will receive as an argument a [DebugSessionCustomEvent](https://docs.nova.app/api-reference/debug-session-custom-event) object representing the event that was received.
	 *
	 * A custom event is any event not explicitly defined by the [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/). No assumptions should be made that callbacks registered with this method will receive events explicitly defined by the protocol, even those that Nova may not yet handle natively (as support for them may be added in the future). If new events are defined in a future version of the protocol this callback *may* be invoked until support for that event is adopted by Nova itself.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onCustomEvent<T>(event: string, callback: (this: T, event: DebugSessionCustomEvent) => void, thisValue?: T): Disposable

	/**
	 * Sends a request to the debug adapter. This request may be a custom request not defined by the Debug Adapter Protocol.
	 *
	 * The `command` argument should be a string representing the request to invoke.
	 *
	 * The `arguments` object can be any JSON-codable value that the adapter expects as the arguments to the request.
	 *
	 * This method returns a `Promise` object which will resolve or reject when the request is handled by the adapter. It may also be rejected if the debug session ends before a response is received. The resolved value will be the JSON value provided in the response object from the adapter.
	 */
	sendRequest(command: string, arguments: any): Promise<unknown>

	/**
	 * Starts a child session running within the scope of the receiver. Child sessions are coordinated as sub-tasks of a parent session to allow grouping multiple debugged targets together (such as a subprocess started by a debuggee).
	 *
	 * The `action` argument should be a [TaskDebugAdapterAction](https://docs.nova.app/api-reference/task-debug-adapter-action) defining how the IDE should connect to the child session. Most often, if a subprocess is started by the debuggee and forwarded by the adapter the child session will be started with an `attach` configuration to connect Nova to this new session already running.
	 *
	 * This method will return a `Promise` object which will resolve or reject when the child session either starts or fails to start, respectively.
	 *
	 * There is (as of early 2022) no mechanism within the Debug Adapter Protocol itself for forwarding notification of child sessions to the IDE. Adapters that utilize this behavior typically define a custom event that is sent when a child session in the IDE is requested. The extension can then use the `onCustomEvent()` method to listen for such events and start child sessions using this method.
	 */
	startChildSession(action: TaskDebugAdapterAction): Promise<void>
}

/// https://docs.nova.app/api-reference/debug-session-custom-event/

/**
 * A `DebugSessionCustomEvent` object represents a custom event sent from a debug adapter.
 *
 * Custom events can be received using the `onCustomEvent()` method of the DebugSession class.
 *
 * The `DebugSessionCustomEvent` class is not subclassable.
 * @since 9.0
 */
interface DebugSessionCustomEvent {
	/** The body of the event. This may be any JSON-codable value, including `null`. */
	body: any
	// TODO: Check if it is settable
	// TODO: Check for undefined

	/** The event name as a string. */
	event: string
	// TODO: Check if it is settable
	// TODO: Check for undefined
}

/// https://docs.nova.app/api-reference/disposable/

/**
 * A `Disposable` is any object that can be “disposed of” to relinquish its resources or cancel its task. The disposable interface is adopted by several objects returned from standard API methods. To conform to the disposable interface, an object needs only to implement a `dispose()` method.
 *
 * The `Disposable` interface is not subclassable.
 */
declare class Disposable {
	/** Returns `true` if the argument provided is a disposable object which responds to `dispose()`. */
	static isDisposable(object: Object): boolean

	/** Relinquishes the object’s resources, which may include stopping a listener, cancelling a task, or some other “event”. Calling `dispose()` multiple times on an object is allowed, but will not affect the object after the first call. */
	dispose(): void
}

/// https://docs.nova.app/api-reference/emitter/

/**
 * An `Emitter` can dispatch events by name to registered listeners. The extension API defines several built-in emitters that are used to dispatch events, and extensions may also create their own emitters to use for event handling.
 *
 * The `Emitter` class is not subclassable.
 * @implements {Disposable}
 * @example
 * let emitter = new Emitter();
 *
 * emitter.on("myEvent", function(arg1, arg2, arg3) {
 *   console.log(arg1, arg2, arg3);
 * });
 *
 * function doTask() {
 *   emitter.emit("myEvent", "foo", "bar", 12);
 * }
 *
 * doTask();
 * // Logs to console: "foo", "bar", 12
 */
declare class Emitter extends Disposable {
	/** Creates a new Emitter object that may be used to register and emit events. */
	constructor()

	/** Adds a listener for the provided event name after any other current listeners. The `callback` argument will be called each time the emitter receives a matching event. */
	on(eventName: string, callback: (...args: any[]) => void): void

	/** Adds a listener for the provided event name after any other current listeners. The `callback` argument will be called the next time the emitter receives a matching event, after which it will be unregistered. */
	once(eventName: string, callback: (...args: any[]) => void): void

	/** Adds a listener for the provided event name before any other current listeners. The `callback` argument will be called each time the emitter receives a matching event. */
	preempt(eventName: string, callback: (...args: any[]) => void): void

	/** Emits a new event with the provided name, optionally including any other provided arguments to the event handler callbacks. */
	emit(eventName: string, ...args: unknown[]): void

	/** Removes all registered listeners for the provided event name, or all listeners if no event name is provided. */
	clear(eventName?: string): void
}

/// https://docs.nova.app/api-reference/environment/

interface Environment {
	/** The global instance AssistantsRegistry object used to register and interact with assistants. */
	readonly assistants: AssistantsRegistry

	/**
	 * The global instance Clipboard object.
	 * @since 1.2
	 */
	readonly clipboard: Clipboard

	/** The global instance CommandsRegistry object used to register and interact with commands. */
	readonly commands: CommandsRegistry

	/**
	 * The Configuration object for the application, written into the user’s global preferences.
	 *
	 * It is recommended that extensions prefix variables they define with a common string, followed by a dot, such as “my_extension.key_name”.
	 *
	 * Variables defined by an extension’s payload using the “configuration” key will automatically be shown in the extension’s global preferences UI.
	 */
	readonly config: Configuration

	/**
	 * The global instance Crypto object.
	 * @since 10.0
	 */
	readonly crypto: Crypto

	/** The global instance of the Credentials object used to interact with credential storage. */
	readonly credentials: Credentials

	/** An `Object` containing the environment variables available to task execution, such as invocations of the Process class. Most often, this includes the values made available to the user’s default login shell. As such, this value can change depending on the state of the user’s preferences for requesting environment from the default login shell. */
	readonly environment: { [key: string]: string }

	/** The current Extension instance representing the running extension. */
	readonly extension: Extension

	/** The global instance of the FileSystem object. */
	readonly fs: FileSystem

	/** An array of strings defining the user’s preferred languages, in BCP 47 format. */
	readonly locales: ReadonlyArray<string>

	/** The global instance of the Path object. */
	readonly path: Path

	/** A CompositeDisposable object that will be cleaned up automatically when the extension is deactivated. Extensions may add any disposable objects they wish to this composite. Built-in objects from the extension runtime do not need to be registered for deactivation (all built-in objects will be cleaned up automatically when an extension is deactivated.) However, custom objects implementing the Disposable interface may wish to receive a call to `dispose()` to perform some action when they are cleaned up. The extension itself should not attempt to dispose of this object, it will be done automatically by the extension runtime at a proper time. */
	readonly subscriptions: CompositeDisposable

	/** The current operation system version, an an `Array` of three `Number` values. Each number corresponds to the major, minor, and patch version of the operation system, respectively (e.g. for *macOS 10.14.0* the returned value would be `[10, 14, 0]`). */
	readonly systemVersion: [number, number, number]

	/** The current application version, as an `Array` of three `Number` values. Each number corresponds to the major, minor, and patch version of the application, respectively (e.g. for *Nova 1.0.2* the returned value would be `[1, 0, 2]`). This array will not reflect whether the application version contains a beta identifier (such as `1.0.2b3`). */
	readonly version: [number, number, number]

	/** The current application version (as a `String`). */
	readonly versionString: string

	/** The current Workspace instance representing the workspace in which the extension is executing. */
	readonly workspace: Workspace

	/** Alert the user by causing an auditory beep. */
	beep(): void

	/**
	 * Returns a localized version of the string designated by the specified key and residing in the specified localization table within the extension.
	 *
	 * This method searches each of the extension’s localizations (directories using an `.lproj` extension) for a JSON file with the name `tableName`. If `tableName` is not provided or `null`, it will search for a default file named `strings.json`. Localizations are searched in the preferred order based on the user’s preferred languages.
	 *
	 * The return value of this method depends on its arguments:
	 * - If `key` is `null` and `value` is `null`, returns an empty string.
	 * - If `key` is `null` and `value` is non-null, returns `value`.
	 * - If `key` is not found and `value` is `null` or an empty string, returns `key`.
	 * - If `key` is not found and `value` is non-null and not empty, return `value`.
	 */
	localize(key: string | null, value?: string | null, tableName?: string | null): string

	/** Whether the current application version is a fully-qualified release (`true`) or a pre-release (`false`). */
	isReleasedVersion(): boolean

	/** Whether the current extension is running in development (ad-hoc) mode. */
	inDevMode(): boolean

	/** Requests the application open the global settings view for a specified extension, by identifier. If no identifier is specified, the current extension’s global settings will be opened. */
	openConfig(identifier?: string): void

	/**
	 * Asks the application to open a url using the user’s preferred handler. For example, passing an HTTP URL to this method will open it the user’s default browser.
	 *
	 * The optional `callback` argument should be a callable, which will be invoked when the URL has been handled. The callback will be passed a boolean value indicating whether the URL was successfully opened (an example of failure would be if no application is installed to handle the URL).
	 */
	openURL(url: string, callback?: (success: boolean) => void): void
}

declare const nova: Environment

/// https://docs.nova.app/api-reference/extension/

/** The `Extension` class contains properties and method related to the current extension. A single instance is always available via the `nova.extension` global property. */
interface Extension {
	/** The identifier of the extension. */
	readonly identifier: string

	/** The user-visible name of the extension. */
	readonly name: string

	/** The vendor of the extension. */
	readonly vendor: string

	/** The version string of the extension. */
	readonly version: string

	/** The path to the extension on disk. */
	readonly path: string

	/** The path to a directory on disk where the extension can store global state. The directory itself may not exist, and it is up to the extension to create it, but the parent directory is guaranteed to exist. */
	readonly globalStoragePath: string

	/** The path to a workspace-specific directory on disk where the extension can store state. The directory itself may not exist, and it is up to the extension to create it, but the parent directory is guaranteed to exist. */
	readonly workspaceStoragePath: string

	/** Opens the extension’s changelog in the Extension Library (under the Release Notes pane). If the extension does not provide a changelog this method will do nothing. */
	openChangelog(): void

	/** Opens the extension’s help documentation in the Extension Library (under the Help pane). If the extension does not provide a help document this method will do nothing. */
	openHelp(): void

	/** Opens the extension’s readme in the Extension Library (under the Details pane). If the extension does not provide a readme this method will do nothing. */
	openReadme(): void
}

/// https://docs.nova.app/api-reference/file/

/** A `File` object can be used to read and write to a location on disk. Files are generally created through the `nova.fs.open()` method of the FileSystem class. */
interface File {
	/** Whether the file has been closed. Once a file is closed, attempts to read, write, or seek within the file will throw an `Error`. */
	readonly closed: boolean

	/** The path to the file on disk, as a string. */
	readonly path: string

	/** Closes the file, releasing the underlying file descriptor. If the file is already closed, this method does nothing. Once a file is closed, attempts to read, write, or seek within the file will throw an `Error`. */
	close(): void

	/** Returns the current position within the file as a number. */
	tell(): number

	/**
	 * This method moves the object’s position forward or backward by an amount specified by the `offset` argument. By default, this is relative to the file’s current position.
	 *
	 * If the optional from argument is specified, the move can be relative to the start of the file (from == `nova.fs.START`), the current position (from == `nova.fs.CURRENT`), the end of the file (from == `nova.fs.END`).
	 */
	seek(offset: number, from?: number): void

	/**
	 * Writes the specified value to the file at the current offset.
	 *
	 * If the value is a ArrayBuffer, the value will be written as bytes no matter which mode the file is in.
	 *
	 * If the value is a string, the value will be written using the file’s default encoding, unless the optional `encoding` argument is used to choose a specific encoding for the write.
	 */
	write(value: string | ArrayBuffer, encoding?: string): void

	/**
	 * Reads a number of bytes from the file at the current offset. If the `size` argument is specified, the file will attempt to read up to that number of bytes. If no more bytes are available, `null` will be returned.
	 *
	 * When bytes are successfully read, if the file is in Binary mode, the returned object will be a [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) object. If it’s in Text mode, the returned object will be a string created using the file’s set encoding.
	 */
	read(size?: number): string | ArrayBuffer | null

	/**
	 * Reads a single line from the file, up to and including any newline. This can be used in a loop to read lines from a file efficiently. When reading the last line of a file, the returned string will not contain a newline. Thus, the return value should be unambiguous as to whether the end of the file has been reached.
	 * @throws This method is only valid for files in Text mode. Attempting to invoke this method on a file in Binary mode will throw an `Error`.
	 */
	readline(): string

	/**
	 * Reads all remaining lines from the file in a loop using the `readline()` method, returning them as an array of strings.
	 * @throws This method is only valid for files in Text mode. Attempting to invoke this method on a file in Binary mode will throw an `Error`.
	 */
	readlines(): string[]
}

/// https://docs.nova.app/api-reference/file-stats/

/** The `FileStats` class details information about a file on disk. `FileStats` objects are returned by the FileSystem class method `nova.fs.stat()`. */
interface FileStats {
	/** The last access time of the file’s content, as a `Date` object. */
	readonly atime: Date

	/** The creation time of the file, as a `Date` object. */
	readonly birthtime: Date

	/**
	 * The last modification time of the file’s metadata, as a `Date` object.
	 * Note: This is not the creation date of the file. Use the `birthtime` property for that. On Unix systems, the “ctime” represents the last time the file’s metadata was modified, not necessarily when the file was created on disk.
	 */
	readonly ctime: Date

	/**
	 * The file mode (permissions mask), as a number.
	 * @since 9.0
	 */
	readonly mode: number

	/** The last modification time of the file’s content, as a `Date` object. */
	readonly mtime: Date

	/** The size of the file, in bytes, as a number. */
	readonly size: number

	/** Returns `true` if the path represents a directory. */
	isDirectory(): boolean

	/** Returns `true` if the path represents a regular file. */
	isFile(): boolean

	/** Returns `true` if the path represents a symbolic link. */
	isSymbolicLink(): boolean
}

/// https://docs.nova.app/api-reference/file-system/

type FileSystemBitField = number & { __t: "FileSystemBitField" }

type Encoding = "utf8" | "utf-8" | "ascii" | "utf16le" | "utf-16le" | "utf16be" | "utf-16be" | "latin1" | "hex" | "base64"

interface FileSystem {
	/** An object containing a set of common constants used with file system operations. */
	readonly constants: {
		/** A bitfield value indicating that a file exists. */
		readonly F_OK: FileSystemBitField

		/** A bitfield value indicating that a file is readable. */
		readonly R_OK: FileSystemBitField

		/** A bitfield value indicating that a file is writable. */
		readonly W_OK: FileSystemBitField

		/** A bitfield value indicating that a file is executable. */
		readonly X_OK: FileSystemBitField

		/** Denotes the start of a file (used by `File.seek()`). */
		readonly START: FileSystemBitField

		/** Denotes the current location of a file (used by `File.seek()`). */
		readonly CURRENT: FileSystemBitField

		/** Denotes the end of a file (used by `File.seek()`). */
		readonly END: FileSystemBitField
	}

	/** A bitfield value indicating that a file exists. */
	readonly F_OK: FileSystemBitField

	/** A bitfield value indicating that a file is readable. */
	readonly R_OK: FileSystemBitField

	/** A bitfield value indicating that a file is writable. */
	readonly W_OK: FileSystemBitField

	/** A bitfield value indicating that a file is executable. */
	readonly X_OK: FileSystemBitField

	/** Denotes the start of a file (used by `File.seek()`). */
	readonly START: FileSystemBitField

	/** Denotes the current location of a file (used by `File.seek()`). */
	readonly CURRENT: FileSystemBitField

	/** Denotes the end of a file (used by `File.seek()`). */
	readonly END: FileSystemBitField

	/**
	 * Returns the path to a directory which may contain temporary files. The path is guaranteed to be scoped to the current extension, but may be shared between multiple instances of the same extension running in different workspaces.
	 *
	 * To guarantee unique filenames when writing temporary files, consider using an API such as Crypto.randomUUID() to generate randomized components.
	 * @since 10.0
	 */
	readonly tempdir: string

	/**
	 * Determines if the file at a specified path is accessible via the specified mode(s). If the path matches the modes, the return value will be `true`, otherwise `false`.
	 *
	 * The `modes` argument is a bitfield created using the `F_OK`, `R_OK`, `W_OK`, and `X_OK` constants.
	 */
	access(path: string, modes: number): boolean

	/**
	 * Sets the permissions mask for a specified path. The `mode` argument should be a number representing a octal bitmask of standard Unix permissions.
	 * @throws Will raise an `Error` if the path does not exist.
	 * @since 9.0
	 */
	chmod(path: string, mode: number): void

	/**
	 * Copies a file at a source path to a destination path.
	 * @throws If no file exists at the source path, or if a file already exists at the destination path, this will throw an `Error`.
	 */
	copy(src: string, dest: string): void

	/**
	 * Copies a file at a source path to a destination path asynchronously. When the operation is complete, the `callback` will be called with an optional error argument (only if the operation failed). The optional `thisValue` argument can be used to bind a custom `this` within the invoked callback.
	 * @throws If no file exists at the source path, or if a file already exists at the destination path, this will return an `Error`.
	 */
	copyAsync(src: string, dest: string, callback: (err?: Error) => void): void

	/**
	 * Copies a file at a source path to a destination path asynchronously. When the operation is complete, the `callback` will be called with an optional error argument (only if the operation failed). The optional `thisValue` argument can be used to bind a custom `this` within the invoked callback.
	 * @throws If no file exists at the source path, or if a file already exists at the destination path, this will return an `Error`.
	 */
	copyAsync<T>(src: string, dest: string, callback: (this: T, err?: Error) => void, thisValue: T): void

	/**
	 * Ejects the disk at the provided path.
	 * @throws If the path does not refer to a mounted volume, this method will throw an `Error`.
	 */
	eject(path: string): void

	/**
	 * Returns an array of paths listing the contents of the specified directory.
	 * @throws If no directory exists at the path (or if it’s not a directory), this will throw an `Error`.
	 */
	listdir(path: string): string[]

	/**
	 * Creates a directory at path.
	 * @throws If a file already exists at the path, this will throw an `Error`.
	 */
	mkdir(path: string): void

	/**
	 * Moves a file at a source path to a destination path.
	 * @throws If no file exists at the source path, or if a file already exists at the destination path, this will throw an `Error`.
	 */
	move(src: string, dest: string): void

	/**
	 * Moves a file at a source path to a destination path asynchronously. When the operation is complete, the `callback` will be called with an optional error argument (only if the operation failed). The optional `thisValue` argument can be used to bind a custom `this` within the invoked callback.
	 * @throws If no file exists at the source path, or if a file already exists at the destination path, this will return an `Error`.
	 */
	moveAsync(src: string, dest: string, callback: (err?: Error) => void): void

	/**
	 * Moves a file at a source path to a destination path asynchronously. When the operation is complete, the `callback` will be called with an optional error argument (only if the operation failed). The optional `thisValue` argument can be used to bind a custom `this` within the invoked callback.
	 * @throws If no file exists at the source path, or if a file already exists at the destination path, this will return an `Error`.
	 */
	moveAsync<T>(src: string, dest: string, callback: (this: T, err?: Error) => void, thisValue: T): void

	/**
	 * Opens a file from the specified path, creating and returning a [File](https://docs.nova.app/api-reference/file) object.
	 *
	 * The mode string argument specifies in what way the file is opened. It can contain the following components:
	 * - **r**: Open for reading (default)
	 * - **w**: Open for writing, truncating the file first
	 * - **x**: Open for exclusive creation, failing if the file exists
	 * - **a**: Open for writing, appending to the end if it exists
	 * - **b**: Binary mode
	 * - **t**: Text mode (default)
	 * - **+**: Open for updating (reading and writing)
	 *
	 * The default mode is `'r'` (open for reading, synonym of `'rt'`). For binary read-write access, the mode `'w+b'` opens and truncates the file to 0 bytes. `'r+b'` opens the file in binary mode without truncation.
	 *
	 * Files can be created in one of two modes: “Binary Mode” or “Text Mode”. In Binary mode, reading from the file will read [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) objects. In Text mode, the file object will attempt to interpret read data in a specific encoding (specified when the file was created) and return string objects. By default, the encoding of a file in text mode with no encoding specified is UTF-8.
	 *
	 * For files opened in Text mode, the optional encoding argument can be used to set what encoding will be used to interpret read and (by default) written data. If this argument is not specified, UTF-8 will be used.
	 *
	 * Supported encodings include:
	 * - “utf8” / “utf-8”
	 * - “ascii”
	 * - “utf16le” / “utf-16le”
	 * - “utf16be” / “utf-16be”
	 * - “latin1”
	 * - “hex”
	 * - “base64”
	 */
	open(path: string, mode?: string, encoding?: Encoding): File
	// TODO: Better mode selection by overloading modes. Needs all possible combination.

	/**
	 * Removes a file at a path. This method is only valid for regular files. If no file exists at the path, this method does nothing.
	 * @throws If the path represents a directory, this will throw an `Error` (use the `rmdir()` method instead).
	 */
	remove(path: string): void

	/**
	 * Removes a directory at a path. This method is only valid for directories. If no directory exists at the path, this method does nothing.
	 * @throws If the path is not a directory, this will throw an `Error`.
	 */
	rmdir(path: string): void

	/** Displays a Finder window and reveals the item represented by the provided path. */
	reveal(path: string): void

	/** Returns information about the file at a path as a FileStats object. If no file exists at the path, this method returns `null` or `undefined`. */
	stat(path: string): FileStats | null | undefined

	/** Creates a FileSystemWatcher object that observes changes to the file system relative to the workspace. The pattern is a glob pattern which specifies the files to observe. The pattern may be `null` to indicate that changes to all files and directories should be observed. The provided callable will be invoked when files are added, modified, or removed. */
	watch(pattern: string | null, callable: (path: string) => void): FileSystemWatcher
}

/// https://docs.nova.app/api-reference/file-system-watcher/

/**
 * A `FileSystemWatcher` observes changes to the file system relative to the current workspace, and invokes callbacks when items are added, changed, or deleted.
 *
 * File system watcher objects are created using the `watch()` method of the FileSystem class.
 * @implements {Disposable}
 */
interface FileSystemWatcher extends Disposable {
	/** Adds an event listener that invokes the provided `callback` when matching files are added, modified, or deleted from the filesystem. The callback will receive the path that was modified. Returns a Disposable object that can be used to cancel the event listener. */
	onDidChange(callback: (path: string) => void): Disposable
}

/// https://docs.nova.app/api-reference/issue/

declare enum IssueSeverity {
	/** Indicating an unrecoverable error (the highest priority). */
	Error,

	/** Indicating a recoverable warning. */
	Warning,

	/** Indicating a code hint. */
	Hint,

	/** Indicating an informative notice (lowest priority). */
	Info
}

/**
 * An `Issue` object defines a single result from a diagnostic pass within a file or workspace. For example, issues may represent parse errors, style warning, and code hints. Issues are delivered to the workspace using [IssueCollection](https://docs.nova.app/api-reference/issue-collection) objects or an issue assistant registered with the [AssistantsRegistry](https://docs.nova.app/api-reference/assistants-registry).
 *
 * The `Issue` class is not subclassable.
 * @example
 * let issue = new Issue();
 *
 * issue.message = "Undefined name 'foobar'";
 * issue.code = "E12";
 * issue.severity = IssueSeverity.Error;
 * issue.line = 10;
 * issue.column = 12;
 *
 * issueCollection.set(fileURI, [issue]);
 */
declare class Issue {
	/** Creates a new `Issue` object. */
	constructor()

	/** A client-defined value (string or number) that may be associated with an issue and used to reference the rule or configuration setting that triggered the issue. */
	code?: string | number

	/** The user-readable string that describes the issue. This value should most often be between one and three sentences for clarity. */
	message?: string

	/** The importance of the issue, and how prominently it will be displayed to the user. */
	severity?: IssueSeverity

	/** An optional value that allows the client to indicate from what tool or checker an issue originated, such as `"jslint"` or `"pyflakes"`. If `null`, the name of the extension will be displayed to the user. */
	source?: string | null

	/**
	 * A [Range](https://docs.nova.app/api-reference/range) value that describes the textual range within the relevant file in which the issue occurred.
	 *
	 * Note: the `textRange` property operates on linear character positions within the entire file. To report issues using a line-column position, see the `line`, `column`, `endLine`, and `endColumn` properties.
	 */
	textRange?: Range

	/**
	 * The line number within the relevant file on which the issue occurred (or starts, if used with `endRange`). Ignored if the `textRange` property is set.
	 *
	 * This value should be 1-based (The first line of a document is represented by the value `1`).
	 */
	line?: number

	/**
	 * The column number within the relevant file on which the issue occurred (or starts, if used with `endColumn`). Ignored unless the `line` property is also set.
	 *
	 * This value should be 1-based (The first column of a line is represented by the value `1`).
	 */
	column?: number

	/**
	 * The line number within the relevant file on which the issue ends. Ignored unless the `line` property is also set.
	 *
	 * This value should be 1-based (The first line of a document is represented by the value `1`).
	 */
	endLine?: number

	/**
	 * The column number within the relevant file on which the issue ends. Ignored unless the `line` and `endLine` properties are also set.
	 *
	 * This value should be 1-based (The first column of a line is represented by the value `1`).
	 */
	endColumn?: number
}

/// https://docs.nova.app/api-reference/issue-collection/

/**
 * An `IssueCollection` object coordinates a group of results from a diagnostic pass within a file or workspace, represented using [Issue](https://docs.nova.app/api-reference/issue) objects.
 *
 * The `IssueCollection` class is not subclassable.
 * @implements {Disposable}
 * @example
 * class MyLinterClass() {
 *   constructor() {
 *     this.issueCollection = new IssueCollection();
 *   }
 *
 *   deliverResults(fileURI, issues) {
 *     this.issueCollection.set(fileURI, issues);
 *   }
 * }
 */
declare class IssueCollection extends Disposable {
	/** Creates a new `IssueCollection` object with a provided name. If no name is provided, the name of the extension will be displayed to the user when required. */
	constructor(name?: string)

	/** The name of the collection, potentially shown to the user. Most commonly the name is that of a diagnostic tool, such as `"jslint"`. */
	readonly name: string

	/**
	 * Appends an array of issues to the collection for a provided file URI.
	 * @throws Attempting to invoke this method after the collection has been disposed will throw an `Error`.
	 */
	append(uri: string, issues: Issue[]): void

	/** Removes all issues from the collection, and removes the collection from its owning workspace. The collection will no longer be displayed to the user. Subsequent attempts to set new issues on the collection will do nothing. */
	dispose(): void

	/** Removes all issues from the collection. */
	clear(): void

	/** Returns a boolean value indicating whether the collection contains any issues for the provided file URI. */
	has(uri: string): boolean

	/** Returns all issues within the collection for a provided file URI. */
	get(uri: string): ReadonlyArray<Issue>

	/**
	 * Replaces all issues within the collection for a provided file URI.
	 * @throws Attempting to invoke this method after the collection has been disposed will throw an `Error`.
	 */
	set(uri: string, issues: Issue[]): void

	/**
	 * Removes all issues within the collection for a provided file URI.
	 * @throws Attempting to invoke this method after the collection has been disposed will throw an `Error`.
	 */
	remove(uri: string): void
}

/// https://docs.nova.app/api-reference/issue-parser/

/**
 * An `IssueParser` object is a streaming-style object capable of parsing [Issue](https://docs.nova.app/api-reference/issue) objects from the string output of a task (such as the standard output of a [Process](https://docs.nova.app/api-reference/process)). This is accomplished by “pushing” lines of output into the parser, which processes that output using a series of predefined [Issue Matcher](https://docs.nova.app/extensions/issue-matchers) rules defined in an extensions JSON manifest.
 *
 * The `IssueParser` class is not subclassable.
 * @example
 * let p = new Process(path, {
 *   args: args
 * });
 *
 * let parser = new IssueParser("my-issue-matcher");
 *
 * p.onStdout((line) => {
 *   parser.pushLine(line);
 * });
 *
 * p.onDidExit((code) => {
 *   let issues = parser.issues;
 * });
 *
 * p.start();
 */
declare class IssueParser {
	/** Creates a new `IssueParser` object with one or more issue matcher names. The `matcherNames` argument may be either a string, in which case a single matcher is used, or an array of strings, in which case multiple matchers are used. */
	constructor(matcherNames?: string | string[])

	/** The array of [Issue](https://docs.nova.app/api-reference/issue) objects that have been successfully parsed from the provided output. If no issues are parsed, an empty array is returned. */
	readonly issues: ReadonlyArray<Issue>

	/** Pushes a new line of output on to the parser, which causes immediate parsing of that line against the current set of matchers. */
	pushLine(line: string): void

	/** Removes all issues from the parser’s issues array and resets any in-progress matching. This can be used to “batch” issues after a known point within the output is reached. */
	clear(): void
}

/// https://docs.nova.app/api-reference/language-client/

/**
 * A `LanguageClient` is an interface for adding a language server compatible with the Language Server Protocol specification. Creating an instance of a `LanguageClient` object sets up configuration for the server, at which point communication with the server is handed-off to the application.
 *
 * The `LanguageClient` class is not subclassable.
 * @example
 * var serverOptions = {
 *   path: path
 * };
 * var clientOptions = {
 *   syntaxes: ['typescript']
 * };
 * var client = new LanguageClient('typescript', 'TypeScript Language Server', serverOptions, clientOptions);
 *
 * client.start();
 */
declare class LanguageClient extends Disposable {
	/**
	 * Creates a `LanguageClient` object for communication with a language server.
	 *
	 * The `identifier` parameter should be a simple, unique string that can be used to identify the server (such as `"typescript"`). It will not be displayed to the user.
	 *
	 * The `name` parameter is the name of the server that can potentially be shown to the user, to indicate that the server has been enabled and is in use.
	 *
	 * The `serverOptions` object defines configuration settings for launching and communicating with the server executable.
	 *
	 * The `clientOptions` object defines configuration settings for how the editor invokes the language client.
	 */
	constructor(
		/** The `identifier` parameter should be a simple, unique string that can be used to identify the server (such as `"typescript"`). It will not be displayed to the user. */
		identifier: string,

		/** The `name` parameter is the name of the server that can potentially be shown to the user, to indicate that the server has been enabled and is in use. */
		name: string,

		/** The `serverOptions` object defines configuration settings for launching and communicating with the server executable. */
		serverOptions: {
			/** Additional arguments to pass. */
			args?: string[]

			/** Additional environment variables to set. */
			env?: { [key: string]: string }

			/** The path to the server executable. Absolute, or relative to the extension’s bundle. */
			path: string

			/** The type of transport to use (“stdio”, “socket”, “pipe”). Defaults to “stdio” if not value is specified. */
			type?: "stdio" | "socket" | "pipe"
		},

		/** The `clientOptions` object defines configuration settings for how the editor invokes the language client. */
		clientOptions: {
			/**
			 * Enable debug logging to the Extension Console.
			 * @since 10.0
			 */
			debug?: boolean

			/**
			 * Custom options to send with the LSP initialize request.
			 * @since 2.0
			 */
			initializationOptions?: Object

			/** Syntaxes for which the client is valid. */
			syntaxes: (
				string |
				{
					/** The syntax name */
					syntax: string

					/** The Language Server Protocol language ID. If not present, the syntax name is used. */
					languageId?: string
				}
			)[]
		}
	)

	/** The identifier of the language client specified when it was created. */
	readonly identifier: string

	/** The visible name of the language client specified when it was created. */
	readonly name: string

	/** A boolean indicating whether the client’s language server is currently running. This value will be false before `.start()` is invoked, and after the language server is stopped. */
	readonly running: boolean

	/**
	 * Adds an event listener that invokes the provided `callback` when the language server stops. The callback will receive as an argument an Error object if the language server stopped unexpectedly. Otherwise, this argument will be `undefined`.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 * @since 2.0
	 */
	onDidStop<T>(callback: (this: T, err?: Error) => void, thisValue?: T): Disposable

	/**
	 * Registers a notification handler with the language client. If the language service sends a notification with the provided method name to the host it will be forwarded to the provided callback. The callback will receive the parameters objects as an argument.
	 *
	 * If another handler was previously registered for the provided method name it will be replaced.
	 *
	 * Note: This should only be used for methods that are not part of the core Language Server Protocol specification. Attempting to register handlers for core methods will not invoke the provided callback.
	 */
	onNotification(method: string, callback: (params: any) => void): void

	/**
	 * Registers a request handler with the language client. If the language service sends a request with the provided method name to the host it will be forwarded to the provided callback. The callback will receive the parameters objects as an argument, and the return value will be returned to the language service as the response. If the return value is a `Promise`, it will be returned once the promise resolves or rejects.
	 *
	 * If another handler was previously registered for the provided method name it will be replaced.
	 *
	 * Note: This should only be used for methods that are not part of the core Language Server Protocol specification. Attempting to register handlers for core methods will not invoke the provided callback.
	 */
	onRequest(method: string, callback: (params: any) => unknown | Promise<unknown>): void

	/** Sends a request with the provided method name to the language service, and returns a `Promise` object that resolves when the reply or an error is received by the host. The resolved value will be the parameters returned in the response. */
	sendRequest(method: string, params?: unknown): Promise<unknown>

	/** Sends a notification with the provided method name to the language service. */
	sendNotification(method: string, params?: unknown): void

	/**
	 * Attempts to asynchronously start the language server. If the server was already running, or is in the process of stopping, this method does nothing. If the server is unable to start, such as if the executable was not found at the specified path or module, then an error will be sent via the `onDidStop` event listener.
	 *
	 * Changed in Nova 2: This method may be invoked safely after the language server stops to attempt to restart it. In previous versions, this would raise an `Error`.
	 */
	start(): void

	/** Attempts to asynchronously stop the language server. If the server was not running, this method does nothing. */
	stop(): void
}

/// https://docs.nova.app/api-reference/notification-center/

/** The `NotificationCenter` class is used to manage notifications presented to the user by an extension. A shared instance is always available as the `nova.notifications` environment property. */
interface NotificationCenter {
	/** Adds a NotificationRequest object to be displayed to the user. */
	add(request: NotificationRequest): Promise<NotificationResponse>

	/** Cancels any pending or displayed notifications with the specified identifier. */
	cancel(identifier: string): void
}

/// https://docs.nova.app/api-reference/notification-request/

/**
 * A `NotificationRequest` object can be used to present a non-interruptive notification to the user.
 *
 * The `NotificationRequest` class is not subclassable.
 */
declare class NotificationRequest {
	/**
	 * Creates a `NotificationRequest` object with an optional identifier.
	 *
	 * The identifier argument can be used to assign a specific meaning to the notification, so that it may be cancelled or handled in a specific way when receiving a response. If no identifier is specified, a random string will be used.
	 *
	 * To request a notification be presented to the user, create a `NotificationRequest` object, set its properties, and add it to the global NotificationCenter object. This will return a `Promise`, which can be used to observe when the notification is dismissed or fails. If the promise succeeds, it will provide a NotificationResponse object as the result.
	 *
	 * Dispatching multiple notification requests with an identifier will automatically cancel any previous requests with the same identifier. Only one notification for the identifier may be displayed to the user at a time. In addition, multiple notifications sent from the same extension may be coalesced or queued to prevent overwhelming notification display.
	 * @example
	 * let request = new NotificationRequest("foobar-not-found");
	 *
	 * request.title = nova.localize("Foobar Not Found");
	 * request.body = nova.localize("Enter the path to the foobar tool.");
	 *
	 * request.type = "input";
	 * request.actions = [nova.localize("OK"), nova.localize("Ignore")];
	 *
	 * let promise = nova.notifications.add(request);
	 * promise.then(reply => {
	 *   console.log(reply);
	 * }, error => {
	 *   console.error(error);
	 * });
	 */
	constructor(identifier?: string)

	/** The identifier for the notification. */
	identifier: string

	/** The title to be displayed to the user. This should be short and concise, and localized if possible. */
	title: string

	/** The body of the notification displayed to the user. This should be localized, if possible. */
	body: string

	/**
	 * A string denoting the type of notification to display. By default, this will be a simple informative notification (with no input boxes).
	 *
	 * The following types are supported:
	 * - “input”: displays an input field to the user
	 * - “secure-input” displays a secure input field (password field) to the user
	 */
	type: "input" | "secure-input"

	/** The default value of the input field, for notifications of the appropriate type. */
	textInputValue: string

	/** The placeholder value of the input field, for notifications of the appropriate type. */
	textInputPlaceholder: string

	/** The set of actions to display to the user, as an array of strings. These should be localized, if possible. */
	actions: string[]
}

/// https://docs.nova.app/api-reference/notification-response/

/** A `NotificationResponse` object represents the result of a notification presented using a [NotificationRequest](https://docs.nova.app/api-reference/notification-request) being dismissed. */
interface NotificationResponse {
	/** The identifier for the notification. */
	readonly identifier: string

	/** The index of the action that was chosen to dismiss the notification, in the same order as the `actions` property specified in the original notification request. If the notification was dismissed for another reason, such as the workspace closing, this value will may `null` or `undefined`. */
	readonly actionIdx?: number | null

	/** The value entered by the user into the notification’s input field, for notifications of the appropriate type. */
	readonly textInputValue?: string
}

/// https://docs.nova.app/api-reference/path/

/** The `nova.path` global object is used to manipulate file system paths. */
interface Path {
	/** Returns the last component (the filename) of the specified path, including any extension. */
	basename(path: string): string

	/** Returns the directory parent of the path. */
	dirname(path: string): string

	/** Returns the file extension of the path. If the path has no file extension, this method returns an empty string. */
	extname(path: string): string

	/** Splits the path into an array with two components: the path + filename without the extension, and the file extension. */
	splitext(path: string): [string, string]

	/** Expands any reference to the user’s home directory using the `~` component to contain the full home directory path. */
	expanduser(path: string): string

	/** Returns `true` if the path is an absolute path. */
	isAbsolute(path: string): boolean

	/** Combines one or more components into one path using the platform’s proper path components. */
	join(...paths: string[]): string

	/** Attempts to normalize a path by expanding symbolic links and other ambiguous components. */
	normalize(path: string): string

	/**
	 * Calculates and returns a relative path between two other paths, inserting `..` components as necessary.
	 * @since 8.0
	 */
	relative(from: string, to: string): string

	/** Splits the path into an array of path components (split on the ‘/’ separator), but including the leading ‘/’ root for absolute paths. */
	split(path: string): string[]
}

/// https://docs.nova.app/api-reference/process/

type ReadableStream<T = any> = any
type WritableStream<T = any> = any

/**
 * A `Process` object can be used to launch a subprocess, establish communication channels, and listen for events.
 *
 * The `Process` class is not subclassable.
 */
declare class Process {
	/** Creates a `Process` object that will launch the executable represented by `command`. */
	constructor(command: string, options?: {
		/** Additional arguments to pass. */
		args?: string[]

		/** Additional environment variables to set. */
		env?: { [key: string]: string }

		/** The current working directory path to set for the process. */
		cwd?: string

		/**
		 * Options for configuring the stdio channels.
		 *
		 * To directly configure each of the stdio channels, specify an array of three elements, each representing how to set up standard in, standard out, and standard error, respectively.
		 *
		 * If an element is `"pipe"`, then a standard pipe will be set up for the channel. The pipe will be exposed through the resulting process’s `stdio` array property at the corresponding index as a WritableStream (stdin) or ReadableStream (stdout and stderr) object.
		 *
		 * If an element is `"ignore"`, then no channel will be set up.
		 *
		 * Passing a number for the element will treat the value as a file descriptor, which must already exist, and set up a channel reading or writing to that descriptor. Passing the values 0, 1, and 2 is effectively the same as setting up a pipe to the parent process’s standard in, standard out, and standard error.
		 *
		 * For convenience, passing the values `"pipe"` or `"ignore"` instead of an array is effectively the same as passing an array of three of that value (such as `["pipe", "pipe", "pipe"]`).
		 *
		 * Additionally, the value `"jsonrpc"` may be passed instead of an array to set up the entire stdio suite to use JSON-RPC communication. If this is done, then the `.request()`, `.notify()`, `.onRequest()`, and `.onNotify()` methods of the resulting process object become available.
		 *
		 * The `stdio` property of the resulting process will only contain a stream value for an element if that element was set up using `pipe`. In all other cases, the value of the `stdio` property’s element will be `null` and it is up to the caller to set up any additional communication.
		 *
		 * By default, if no `stdio` option is passed, it is the same as passing the value `["pipe", "pipe", "pipe"]`.
		 */
		stdio?: ["pipe" | "ignore", "pipe" | "ignore", "pipe" | "ignore"] | "pipe" | "ignore" | "jsonrpc" | number

		/**
		 * Run the subprocess within a shell.
		 *
		 * If the value of the shell option is `true`, the subprocess will be invoked using `/bin/sh`. If it’s a string, the shell path specified by the string will be used.
		 *
		 * Any arguments and environment set up for the subprocess will be passed to the shell, and then forwarded to the subprocess by the shell normally.
		 *
		 * Warning: Executing arbitrary processes with arguments within a shell environment may be susceptible to shell injection attacks. Care should be taken to sanitize any input that is passed to the shell environment.
		 */
		shell?: true | string
	})

	/** The arguments passed to the process (as an Array), including any specified when the Process was constructed. */
	readonly args: ReadonlyArray<string>

	/** The command used to launch the process. */
	readonly command: string

	/** The current working directory for the process. If not specified, the project directory will be used. */
	readonly cwd: string

	/** The environment variables set for the process, including any specified when the Process was constructed. */
	readonly env: { [key: string]: string }

	/** The process identifier (PID) of the subprocess. If the process has not been started, this property will be zero. */
	readonly pid: number

	/** An array of three elements, representing the standard in, standard out, and standard error communication channels, respectively. If the process was set up using pipes for the stdio elements, this array will contain corresponding [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) (stdin) or [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) (stdout and stderr) objects at the appropriate index. Otherwise, the value at the given index will be `null`. */
	readonly stdio: [
		WritableStream | null,
		ReadableStream | null,
		ReadableStream | null,
	]

	/** Returns the standard in channel from the receiver’s `stdio` array. This is the same as calling `process.stdio[0]`. */
	readonly stdin: WritableStream | null

	/** Returns the standard out channel from the receiver’s `stdio` array. This is the same as calling `process.stdio[1]`. */
	readonly stdout: ReadableStream | null

	/** Returns the standard error channel from the receiver’s `stdio` array. This is the same as calling `process.stdio[2]`. */
	readonly stderr: ReadableStream | null

	/**
	 * Adds an event listener that invokes the provided `callback` when a line is read from the subprocess’s `stdout` pipe. The callback will receive the line that was read as a string argument. Data from `stdout` will be read as UTF-8 text.
	 *
	 * This method is effectively a convenience for getting the process’s `stdout` stream, acquiring a reader on it, and using that reader to read lines as UTF-8 text. While a handler is set, this effectively means the `stdout` reader is always locked.
	 *
	 * If you need to access standard out data in a different way (such as by bytes), consider accessing the `stdout` property and configuring the stream directly.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 *
	 * @throws If the process was not configured to use a pipe for standard out, this method will throw an `Error`.
	 */
	onStdout<T>(callback: (this: T, line: string) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when a line is read from the subprocess’s `stderr` pipe. The callback will receive the line that was read as a string argument. Data from `stderr` will be read as UTF-8 text.
	 *
	 * This method is effectively a convenience for getting the process’s `stderr` stream, acquiring a reader on it, and using that reader to read lines as UTF-8 text. While a handler is set, this effectively means the `stderr` reader is always locked.
	 *
	 * If you need to access standard error data in a different way (such as by bytes), consider accessing the `stderr` property and configuring the stream directly.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 *
	 * @throws If the process was not configured to use a pipe for standard error, this method will throw an `Error`.
	 */
	onStderr<T>(callback: (this: T, line: string) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the subprocess terminates. The callback will receive as an argument the exit status (as a `Number`) of the subprocess.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidExit<T>(callback: (this: T, status: number) => void, thisValue?: T): Disposable

	/**
	 * Starts the subprocess.
	 * @throws If the process could not be launched because a valid executable was not found, this method will raise an `Error`.
	 * @throws If the process has already been launched, this method will also raise an `Error`.
	 */
	start(): void

	/** Sends a signal to the subprocess, specified by the `signal` argument. The signal may be a string (such as `"SIGINT"`, `"SIGTERM"`, or `"SIGHUP"`) or a number. */
	signal(signal: "SIGINT" | "SIGTERM" | "SIGHUP" | number): void

	/** Attempts to terminate the subprocess using `SIGKILL`. If the subprocess successfully terminates, then event handlers registered using `onDidExit()` will be invoked just as if the subprocess terminated on its own. */
	kill(): void

	/** Attempts to terminate the subprocess using `SIGTERM`. If the subprocess successfully terminates, then event handlers registered using `onDidExit()` will be invoked just as if the subprocess terminated on its own. */
	terminate(): void

	/**
	 * Sends a JSON-RPC notification with a provided method name and parameters to a process. The parameters object must be JSON-encodable.
	 * @throws If the process was not configured to use JSON-RPC communication, calling this method will throw an `Error`.
	 * @example
	 * process.notify('didSave', {'file': 'foo.txt'});
	 */
	notify(methodName: string, params?: any): void

	/**
	 * Sends a JSON-RPC request with a provided method name and parameters to a process. The parameters object must be JSON-encodable.
	 *
	 * This method returns a `Promise` object that will resolve or reject once the request has been handled by the process, or if communication fails or the connection is terminated prematurely.
	 *
	 * The argument passed to any resolution (`then()`) hander will be a JSON-encodable object representing the `result` of the request.
	 *
	 * The argument passed to any rejection (`catch()`) handler will be a [ProcessMessage](https://docs.nova.app/api-reference/process-message) object.
	 * @throws If the process was not configured to use JSON-RPC communication, calling this method will immediately throw an `Error`.
	 * @example
	 * process.request('getNames', {'sort': 'alpha'}).then(function(reply) {
	 *   console.log("Received response: " + reply.result);
	 * });
	 */
	request(methodName: string, params?: any): Promise<any>

	/**
	 * If the process was configured to use JSON-RPC (see the Standard I/O section, above), then this method will add an event handler for a provided notification method name.
	 *
	 * The callback will be invoked when the extension receives a notification with a matching name from the process. The callback will be provided the [ProcessMessage](https://docs.nova.app/api-reference/process-message) that was sent.
	 * @throws If the process was not configured to use JSON-RPC communication, calling this method will throw an `Error`.
	 * @example
	 * process.onNotify('didConnect', function(message) {
	 *   console.log("The server successfully connected.");
	 * });
	 */
	onNotify(methodName: string, callback: (message: ProcessMessage<any, any, any>) => void): Disposable

	/**
	 * If the process was configured to use JSON-RPC (see the Standard I/O section, above), then this method will add an event handler for a provided request method name.
	 *
	 * The callback will be invoked when the extension receives a request with a matching name from the process. The callback will be provided the [ProcessMessage](https://docs.nova.app/api-reference/process-message) that was sent.
	 *
	 * The callback should return a reply to be transmitted back to the process (which may be any object that is JSON-encodable). If the reply is a `Promise` object, then the extension runtime will automatically wait until the promise is resolved before sending the response.
	 *
	 * Should the promise be rejected, the runtime will attempt to form a reply from the rejection reason, returned as a JSON-RPC error message.
	 * @throws If the process was not configured to use JSON-RPC communication, calling this method will throw an `Error`.
	 * @example
	 * process.onRequest('getCount', function(request) {
	 *   return Promise(function(resolve, reject) {
	 *     resolve({'count': 10});
	 *   });
	 * });
	 */
	onRequest(methodName: string, callback: (message: ProcessMessage<any, any, any>) => any): Disposable
}

/// https://docs.nova.app/api-reference/process-message/

/** A `ProcessMessage` object is represents a messages sent from a subprocess to the extension via JSON-RPC. `ProcessMessage` objects are only used with a [Process](https://docs.nova.app/api-reference/process) object which has been set up to use JSON-RPC communication. */
interface ProcessMessage<P, R, E> {
	/** The method name of the message, as a string. If the message is a response, this will be `null`. */
	readonly method: string | null

	/** An object containing the parameters of the message. All values are JSON-encodable. */
	readonly parameters?: P

	/** If the message is a response whose request succeeded, this will contain the result object of the response, otherwise this will be `null`. */
	readonly result: R

	/** If the message is a response whose request failed, this will contain the error code object of the response, otherwise this will be `null`. */
	readonly errorCode: number | null

	/** If the message is a response whose request failed, this will contain the error reason object of the response, otherwise this will be `null`. */
	readonly errorReason: string | null

	/** If the message is a response whose request failed, this will contain the error data object of the response (if any), otherwise this will be `null`. */
	readonly errorData: E | null
}

/// https://docs.nova.app/api-reference/range/

/**
 * A `Range` represents a contiguous, linear region of an element, specified by a start and end index. Most often it is used to indicate sections of a text stream.
 *
 * The `Range` class is not subclassable.
 */
declare class Range {
	/**
	 * Creates a new `Range` with a provided `start` and end `index`.
	 * @throws Raises an `Error` if the end index precedes the start index.
	 */
	constructor(start: number, end: number)

	/** The start index of the range, as a `Number`. */
	readonly start: number

	/** The end index of the range, as a `Number`. */
	readonly end: number

	/** The length of the range, as a `Number`. This is equivalent to subtracting `start` from `end`. */
	readonly length: number

	/** A `Boolean` indicating whether the range is empty (its start and end indices are the same). */
	readonly empty: boolean

	/** Returns `true` if the receiver is equal to another provided range, `false` otherwise. */
	isEqual(range: Range): boolean

	/** Returns a `Number` indicating how a provided range compares to the receiver in sort order. The return value will be `-1` if the receiver’s start index precedes the other’s, or if the same, if its length is shorter. The return value will be `1` if the opposite is true. The return value will be `0` if the ranges are equal. */
	compare(range: Range): number

	/** Returns `true` if the receiver fully contains another provided range, `false` otherwise. */
	containsRange(range: Range): boolean

	/** Returns `true` if the receiver contains a provided index, `false` otherwise. */
	containsIndex(index: number): boolean

	/** Returns a new `Range` representing a union of the receiver and a provided range. */
	union(range: Range): Range

	/** Returns a new `Range` representing an intersection of the receiver and a provided range. If the two ranges to not intersect, the returned range will have zero start and end indices. */
	intersection(range: Range): Range

	/** Returns `true` if the receiver intersects a provided range (shares at least one index), `false` otherwise. */
	intersectsRange(range: Range): boolean
}

/// https://docs.nova.app/api-reference/scanner/

/**
 * A `Scanner` object is a simple string parser that allows for easy scanning for substrings and characters in a character set, and well as numeric values in several representations.
 *
 * To set a scanner object to ignore a set of characters as it scans the string, use the `skipChars` property. Characters in the skip set are skipped over before the target is scanned. The default set of characters to skip is the whitespace and newline character set.
 *
 * The `Scanner` class is not subclassable.
 * @example
 * let string = "Foobar abc 12.0";
 *
 * let scanner = new Scanner(string);
 *
 * scanner.scanString("Foo"); // => "Foo"
 * scanner.scanString("Foo"); // => null
 * scanner.scanString("bar"); // => "bar"
 *
 * scanner.scanChars(Charset.alphanumeric); // => "abc";
 *
 * scanner.scanFloat(); // => 12.0
 * scanner.scanFloat(); // => null
 *
 * scanner.atEnd; // => true
 */
declare class Scanner {
	/** Creates a new `Scanner` object with a provided string to scan. */
	constructor(string: string)

	/** The string the scanner is parsing. */
	readonly string: string

	/** The current character position of the scanner in its string as an integer. */
	location: number

	/** Whether the scanner’s location is at the end of its string. */
	readonly atEnd: boolean

	/** The set of characters that should be skipped during parsing, as a [Charset](https://docs.nova.app/api-reference/charset). Characters in the skip set are skipped over before the target is scanned. The default set of characters to skip is the whitespace and newline character set. */
	skipChars: Charset

	/** Whether the scanner parses using case-sensitive rules. By default this is `false`. */
	caseSensitive: boolean

	/** Scans the provided string, returning the string if found and `null` if it was not found. */
	scanString(string: string): string | null

	/** Scans the string until a given string is encountered, accumulating characters in a string that is returned. If no characters are scanned (such as if the string to be scanned up to is already at the scan location or the scanner is empty), this method returns `null`. */
	scanUpToString(string: string): string | null

	/** Scans for characters in the provided [Charset](https://docs.nova.app/api-reference/charset), accumulating them into a string that is returned. If no characters are scanned, this method returns `null`. */
	scanChars(charset: Charset): string | null

	/** Scans the string until a character in the provided [Charset](https://docs.nova.app/api-reference/charset) is encountered, accumulating characters in a string that is returned. If no characters are scanned (such as if a characters to be scanned up to is already at the scan location or the scanner is empty), this method returns `null`. */
	scanUpToChars(charset: Charset): string | null

	/** Scans for an integer value in decimal representation, returning it if found, and returning `null` if no value is found. */
	scanInt(): number | null

	/** Scans for a floating-point value in decimal representation, returning it if found, and returning `null` if no value is found. */
	scanFloat(): number | null

	/** Scans for an integer value in hexadecimal representation, returning it if found, and returning `null` if no value is found. */
	scanHexInt(): number | null

	/** Scans for a floating-point value in hexadecimal representation, returning it if found, and returning `null` if no value is found. */
	scanHexFloat(): number | null
}

/// https://docs.nova.app/api-reference/scope-selector/

/**
 * A `ScopeSelector` object represents a single text selector used for the names of scopes in syntax grammars. These objects can be used to determine whether a specific region of text matches a specific subset of selector classes, such as for use in completions.
 * @since 3.0
 */
declare class ScopeSelector {
	/**
	 * Creates a new scope selector from the provided string. The string must follow the standard format used for [syntax grammar scopes](https://docs.nova.app/syntax-reference/scopes): a set of alphanumeric identifiers that are separated by period (`.`) characters. The universal selector `*` is also allowed. Any other characters (including whitespace) will be ignored and stripped from the string.
	 *
	 * The special class `*` is reserved to represent the universal selector, which will match any other selector compared to it. If this class is included as a component of any selector it will be assumed to also represent the universal selector.
	 */
	constructor(string: string)

	/** An array of strings representing the set of period-separated classes that were specified in the string which created the selector. The classes are not guaranteed to be in any particular order, and may not represent the order that was originally specified. */
	readonly classes: ReadonlyArray<string>

	/** The string which created the selector. */
	readonly string: string

	/**
	 * Returns a boolean value as to whether the selector or string provided matches the receiver.
	 * @throws The argument must be either another `ScopeSelector` instance or a string that can be resolved as such. Passing any other value will raise an `Error`.
	 */
	matches(selectorOrString: ScopeSelector | string): boolean
}

/// https://docs.nova.app/api-reference/symbol/

type SymbolType =
// Types
| "type"
| "class"
| "category"
| "interface"
| "enum"
| "union"
| "struct"

// Callables
| "function"
| "method"
| "closure"
| "constructor"
| "destructor"
| "getter"
| "setter"
| "static-method"

// Values
| "constant"
| "variable"
| "property"
| "argument"
| "color"
| "enum-member"
| "static-property"

// Expressions
| "expression"
| "statement"
| "block"
| "heading"
| "comment"
| "package"
| "file"
| "reference"
| "keyword"
| "bookmark"

// Stylesets
| "style-ruleset"
| "style-directive"
| "style-id"
| "style-class"
| "style-pseudoclass"
| "style-pseudoelement"

// Tags
| "tag"
| "tag-head"
| "tag-title"
| "tag-meta"
| "tag-link"
| "tag-body"
| "tag-script"
| "tag-style"
| "tag-heading"
| "tag-section"
| "tag-container"
| "tag-ul"
| "tag-ol"
| "tag-li"
| "tag-anchor"
| "tag-image"
| "tag-media"
| "tag-form"
| "tag-form-field"
| "tag-framework"

/**
 * A `Symbol` represents a symbolic construct within an editor’s text, such as a function, type, or interface. Extensions can request symbols from a [TextEditor](https://docs.nova.app/api-reference/text-editor) instance at specific positions in the text.
 *
 * The `Symbol` class is not subclassable.
 */
interface Symbol {
	/** The type of the symbol, as a string. */
	readonly type: SymbolType

	/** The range of the symbol within the text, as a [Range](https://docs.nova.app/api-reference/range) object. */
	readonly range: Range

	/** The name of the symbol as used in quick open and autocomplete. */
	readonly name: string

	/** The range of the symbol’s name within the text, as a [Range](https://docs.nova.app/api-reference/range) object. This does not necessarily match exactly with the `name` property, such as if transformations were made on the name during symbolication. */
	readonly nameRange: Range

	/** The name of the symbol as presented in the Symbols list. This may include additional contextual information not included in the text. */
	readonly displayName: string

	/** The comment text associated with the symbol, if any. */
	readonly comment: string | null

	/** The parent symbol containing the receiver, if any. For example, a method symbol’s parent might be a containing class. */
	readonly parent: Symbol | null
}

/// https://docs.nova.app/api-reference/task/

declare type TaskName = string & { __type: 'TaskName' }

/**
 * A `Task` object is used to represent a dynamically-defined task that the user can choose and invoke in the IDE’s task running interface. It allows customization of one or more standard actions in the tasks interface represented in the toolbar and menus.
 *
 * The `Task` class is not subclassable.
 * @since 2.0
 */
declare class Task {
	/** An action name used to denote an action bound to “Build”. */
	static readonly Build: TaskName

	/** An action name used to denote an action bound to “Clean”. */
	static readonly Clean: TaskName

	/** An action name used to denote an action bound to “Run”. */
	static readonly Run: TaskName

	/**
	 * Creates a new task object with the provided user-readable name, as a string.
	 * @example
	 * let task = new Task("Say Example");
	 *
	 * task.setAction(Task.Build, new TaskProcessAction('/usr/bin/say', {
	 *   args: ["I'm Building!"],
	 *   env: {}
	 * }));
	 *
	 * task.setAction(Task.Run, new TaskProcessAction('/usr/bin/say', {
	 *   args: ["I'm Running!"],
	 *   env: {}
	 * }));
	 *
	 * task.setAction(Task.Clean, new TaskProcessAction('/usr/bin/say', {
	 *   args: ["I'm Cleaning!"],
	 *   env: {}
	 * }));
	 */
	constructor(name: string)

	/** The user-readable name of the task as a string. */
	name: string

	/** The name of an image to show for the item (see [Images](https://docs.nova.app/extensions/images) for more information). */
	image: string

	/**
	 * If set to `true`, then invoking the “Run” action of the task will first invoke the “Build” task. By default, this is `false`.
	 * @since 5.0
	 */
	buildBeforeRunning: boolean

	/** Returns the action that is defined for the provided name, or `undefined` if no action is set. */
	getAction(name: string): TaskProcessAction | undefined
	/** Returns the action that is defined for the provided name, or `undefined` if no action is set. */
	getAction<T extends Transferrable>(name: string): TaskResolvableAction<T> | undefined

	/** Sets an action for a provided name. If `action` is `null` or `undefined` the action will be removed from the task. */
	setAction(name: string, action?: TaskProcessAction | null): void
	/** Sets an action for a provided name. If `action` is `null` or `undefined` the action will be removed from the task. */
	setAction<T extends Transferrable>(name: string, action?: TaskResolvableAction<T> | null): void
}

/// https://docs.nova.app/api-reference/task-action-resolve-context/

/**
 * A `TaskActionResolveContext` object contains contextual information about a [TaskResolvableAction](https://docs.nova.app/api-reference/task-resolvable-action) instance being resolved in response to the user invoking it. An object of this type will be provided to a task provider’s `resolveTaskAction()` method.
 *
 * The `TaskActionResolveContext` class is not subclassable.
 * @since 4.0
 */
interface TaskActionResolveContext<T extends Transferable> {
	/** The action type name of the action being invoked, such as `Task.Build`, `Task.Run`, or `Task.Clean`. This value can be compared to see what type of action to resolve. */
	readonly action: TaskName

	/**
	 * If the action being resolved is from a Task Template (defined in an extension’s manifest `taskTemplates` key), the property will be a [Configuration](https://docs.nova.app/api-reference/configuration) object that contains configuration values as set in the Project Settings for the task.
	 *
	 * If the action being resolved is not from a task template (such as one provided by a task assistant) this property will be `undefined`.
	 *
	 * The configuration object provided for this property is transient. It will not continue to be referenced by the runtime after this resolution of the action is complete. As such, attempting to set values or observe changes on it won’t be particularly useful.
	 * @since 5.0
	 */
	readonly config?: Configuration

	/**
	 * The arbitrary data argument that was provided for the resolvable action which is being resolved.
	 *
	 * This object can be of any type that is *transferrable*, or encodable in the same way as arguments to the [CommandsRegistry](https://docs.nova.app/api-reference/commands-registry). If not set when the action was defined, this property will be `undefined`.
	 */
	readonly data?: T
}

/// https://docs.nova.app/api-reference/task-command-action/

/**
 * A `TaskCommandAction` object represents an action that can be used as part of a [Task](https://docs.nova.app/api-reference/task) that invokes an extension command registered with the [CommandsRegistry](https://docs.nova.app/api-reference/commands-registry), much in the same way as if the user had chosen a menu item bound to it.
 *
 * The `TaskCommandAction` class is not subclassable.
 * @since 3.0
 */
declare class TaskCommandAction {
	/** Creates a `TaskCommandAction` object that will invoke the extension command named `command`. */
	constructor(command: string, options?: {
		/** Arguments to pass to the command. */
		args?: string[]
	})

	/**
	 * The arguments passed to the command.
	 *
	 * See documentation for the [CommandsRegistry](https://docs.nova.app/api-reference/commands-registry) for more information about how commands are invoked and how their arguments are handled.
	 */
	readonly args: ReadonlyArray<string>

	/** The name used to register the command. */
	readonly command: string
}

/// https://docs.nova.app/api-reference/task-debug-adapter-action/

/**
 * A `TaskDebugAdapterAction` object represents an action that can be used as part of a [Task](https://docs.nova.app/api-reference/task) which invokes a [debug adapter](https://docs.nova.app/extensions/debug-adapters) conforming to the [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/).
 *
 * The `TaskDebugAdapterAction` class is not subclassable.
 * @since 9.0
 */
declare class TaskDebugAdapterAction {
	/**
	 * Creates a `TaskDebugAdapterAction` object that interfaces with a debug adapter.
	 *
	 * The `adapterType` is a string denoting the adapter’s identifier. This identifier should be unique across the workspace, and is generally recommended to be the identifier of the debugger or adapter itself, such as `debugpy`, `chrome-devtools`, etc. This parameter is used to link the instance with its [adapter description](https://docs.nova.app/extensions/debug-adapters/#manifest-description) in the extension manifest.
	 * @example
	 * class PythonTaskAssistant {
	 *   resolveTaskAction(context) {
	 *     let config = context.config;
	 *
	 *     let action = new TaskDebugAdapterAction('debugpy');
	 *
	 *     action.command = "/usr/bin/python3";
	 *     action.args = ["-m", "debugpy"];
	 *
	 *     action.debugArgs = {
	 *       program: config.get("python.debug.script", "string")
	 *     };
	 *
	 *     task.setActionAction(Task.Run, action);
	 *   }
	 * }
	 */
	constructor(adapterType: string)

	/**
	 * Determines how the adapter is started by Nova. Valid values are:
	 * - `launch`: The adapter is launched directly by Nova. This is the default if a value is not specified.
	 * - `attach`: Nova attempts to attach to an already-running instance of the adapter. A `transport` other than `stdio` must be specified for attaching.
	 */
	adapterStart?: "launch" | "attach"

	/**
	 * The arguments passed to the debug adapter process.
	 *
	 * **Note:** these are the arguments passed when launching the `adapter`, not the debuggee. Passing arguments to the debuggee requires support from the adapter via a key in the [debugArgs](https://docs.nova.app/api-reference/task-debug-adapter-action/#debugargs) property. This property is ignored if the adapter is not launched by Nova.
	 */
	args?: string[]

	/** The command used to launch the debug adapter. This property is ignored if the adapter is not launched by Nova. */
	command?: string

	/** The current working directory for the debug adapter. If not specified, the project directory will be used. This property is ignored if the adapter is not launched by Nova. */
	cwd?: string

	/**
	 * Arguments passed to the debug adapter for use in setting up its options and starting the debuggee. This corresponds to the `arguments` argument of the [Launch](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Launch) or [Attach](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Attach) request of the Debug Adapter Protocol.
	 *
	 * This object is freeform and the contents of it is not defined by Nova’s extension API (beyond it being an object). Check the documentation for the specific adapter for more information.
	 */
	debugArgs?: object

	/**
	 * The method by which the adapter should attempt to start debugging the debuggee. Valid values are:
	 * - `launch`: The adapter will attempt to launch the debuggee by sending a [Launch](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Launch) request.
	 * - `attach`: The adapter will attempt to connect to the debuggee by sending an [Attach](https://microsoft.github.io/debug-adapter-protocol/specification#Requests_Attach) request.
	 *
	 * Not all adapters support both types of debug request. Check the documentation for the specific adapter for more information.
	 */
	debugRequest?: "launch" | "attach"

	/** The environment variables (as an Object) set for the debug adapter. This property is ignored if the adapter is not launched by Nova. */
	env?: { [key: string]: string }

	/** The host on which to attempt to connect to a Socket to communicate with the adapter. This property is only referenced when the transport is set to `socket`. By default, if no value is specified, this defaults to `localhost`. */
	socketHost?: string

	/** The path at which to connect to a Unix Domain Socket to communicate with the adapter. This property is only referenced when the `transport` is set to `domainSocket`. This property is required if using Unix Domain Socket communication. */
	socketPath?: string

	/** The port on which to attempt to connect to a Socket to communicate with the adapter. This property is only referenced when the `transport` is set to `socket`. This property is required if using Socket communication. */
	socketPort?: number

	/**
	 * The transport mechanism to use to communicate with the adapter. Valid values are:
	 * - `stdio`: Communicate using Standard I/O. Only valid when the adapter is launched by Nova.
	 * - `socket`: Communicate using a TCP Socket. A `socketPort` *must* be specified and a `socketHost` is optional.
	 * - `domainSocket`: Communicate using a Unix Domain Socket. A `socketPath` must be specified.
	 */
	transport?: "stdio" | "socket" | "domainSocket"
}

/// https://docs.nova.app/api-reference/task-process-action/

/**
 * A `TaskProcessAction` object represents an action that can be used as part of a Task which invokes a Unix subprocess, much in the same way as the [Process](https://docs.nova.app/api-reference/process) class.
 *
 * The `TaskProcessAction` class is not subclassable.
 * @since 2.0
 */
declare class TaskProcessAction {
	/**
	 * Creates a `TaskProcessAction` object that will launch the executable represented by `command`.
	 * @example
	 * let action = new TaskProcessAction('/usr/bin/say', {
	 *   args: ["I'm Running!"],
	 *   env: {}
	 * });
	 *
	 * task.setActionAction(Task.Run, action);
	 */
	constructor(command: string, options?: {
		/** Additional arguments to pass. */
		args?: string[]

		/** Additional environment variables to set. */
		env?: { [key: string]: string }

		/** The current working directory path to set for the process. */
		cwd?: string

		/** Run the subprocess within a shell. */
		shell?: boolean

		/** An array of [Issue Matcher](https://docs.nova.app/extensions/issue-matchers/) names used to process output from the action. */
		matchers?: string[]
	})

	/** The arguments passed to the process, including any specified when the Process was constructed. */
	readonly args: ReadonlyArray<string>

	/** The command used to launch the process. */
	readonly command: string

	/** The current working directory for the process. If not specified, the project directory will be used. */
	readonly cwd: string

	/** The environment variables set for the process, including any specified when the Process was constructed. */
	readonly env: { [key: string]: string }

	/** An array of [Issue Matcher](https://docs.nova.app/extensions/issue-matchers) names that will be used when processing output from the action. If not specified, the standard set of matchers will be used. */
	readonly matchers: ReadonlyArray<string>
}

/// https://docs.nova.app/api-reference/task-resolvable-action/

/**
 * A `TaskResolvableAction` object represents an action that can be used as part of a [Task](https://docs.nova.app/api-reference/task) whose execution details are not known when the action is created. When the user invokes a task’s resolvable action, the action’s task provider will be queried to resolve the action into a more concrete type (such as a [TaskProcessAction](https://docs.nova.app/api-reference/task-process-action).
 *
 * The `TaskResolvableAction` class is not subclassable.
 * @since 4.0
 */
declare class TaskResolvableAction<T extends Transferrable> {
	/** Creates a `TaskResolvableAction` object. */
	constructor(options?: {
		/** An arbitrary transferrable (encodable) type that will be provided when the action is resolved */
		data?: T
	})

	/**
	 * The arbitrary data argument that will be passed to the action’s task provider when it is resolved.
	 *
	 * This object can be of any type that is *transferrable*, or encodable in the same way as arguments to the [CommandsRegistry](https://docs.nova.app/api-reference/commands-registry).
	 *
	 * This value will be provided to the task assistant’s `resolveTaskAction()` method through the `context` parameter of type [TaskActionResolveContext](https://docs.nova.app/api-reference/task-action-resolve-context).
	 */
	readonly data: T
}

/// https://docs.nova.app/api-reference/text-document/

/** A `TextDocument` represents an open text document in the application. Text document objects are not directly mutable, requiring a [TextEditor](https://docs.nova.app/api-reference/text-editor) object to make modifications. Text documents are not one-to-one to text editors, since multiple editors may be open for a single document. */
interface TextDocument {
	/** Returns the document’s unique URI, as a `String`. The URI is guaranteed to exist for all documents, but may change if the document is moved. Unsaved documents have a URI with an `unsaved://` scheme. */
	readonly uri: string

	/** Returns the document’s path, as a `String`. If the document is remote, this will be the path on the relevant server. If the document is unsaved, this may be `null` or `undefined`. */
	readonly path?: string | null

	/** Returns `true` if the document is a remote document. */
	readonly isRemote: boolean

	/** Returns `true` if the document has modifications that are not yet saved to disk. */
	readonly isDirty: boolean

	/** Returns `true` if the document contains no text. */
	readonly isEmpty: boolean

	/** Returns `true` if the document has not yet been saved to disk, and does not have a path. */
	readonly isUntitled: boolean

	/** Returns `true` if the document has been closed. Closed documents are no longer interact-able. */
	readonly isClosed: boolean

	/** Returns, as a `String`, the default line ending string used by the document. */
	readonly eol: string

	/** Returns the length of the document in characters. */
	readonly length: number

	/** Returns the identifier for the document’s language syntax. If the document is plain text, this may be `null` or `undefined`. */
	readonly syntax?: string | null

	/**
	 * Returns a section of the document’s text indicated by a provided [Range](https://docs.nova.app/api-reference/range) as a `String`.
	 * @throws If the range exceeds the receiver’s bounds, an `Error` will be thrown.
	 */
	getTextInRange(range: Range): string

	/**
	 * Given a [Range](https://docs.nova.app/api-reference/range), this method will return the range of all lines encompassing that range.
	 * @throws If the range exceeds the receiver’s bounds, an `Error` will be thrown.
	 */
	getLineRangeForRange(range: Range): Range

	/** Adds an event listener that invokes the provided `callback` when the document’s path changes. The callback will receive as an argument the document object and the new path (or `null` if the document does not have a path). */
	onDidChangePath(callback: (document: TextDocument, path: string | null) => void): Disposable

	/** Adds an event listener that invokes the provided `callback` when the document’s syntax (language) changes. The callback will receive as an argument the document object and the new syntax name (or `null` if the document does not have a syntax / is plain text). */
	onDidChangeSyntax(callback: (document: TextDocument, syntax: string | null) => void): Disposable
}

/// https://docs.nova.app/api-reference/text-edit/

/**
 * A `TextEdit` describes a single change that may be applied to a [TextEditor](https://docs.nova.app/api-reference/text-editor). An array of `TextEdit` objects represent a set of changes that may be applied together atomically. `TextEdit` objects are most often used with APIs such as [CompletionItem](https://docs.nova.app/api-reference/completion-item) to describe set of edits to apply.
 * @since 2.0
 */
declare class TextEdit {
	/** Returns a new text edit that deletes text in the [Range](https://docs.nova.app/api-reference/range) `range`. */
	static delete(range: Range): TextEdit

	/** Returns a new text edit that inserts text at position. */
	static insert(position: number, newText: string): TextEdit

	/** Returns a new text edit that replaces the [Range](https://docs.nova.app/api-reference/range) `range` with `newText`. */
	static replace(range: Range, newText: string): TextEdit

	/** Creates a new text edit that replaces the [Range](https://docs.nova.app/api-reference/range) `range` with `newText`. */
	constructor(range: Range, newText: string)

	/** A `String` that will be inserted when the text edit is applied. */
	readonly newText: string

	/** The [Range](https://docs.nova.app/api-reference/range) that will be replaced when the edit is applied. */
	readonly range: Range
}

/// https://docs.nova.app/api-reference/text-editor/

/** A `TextEditor` represents an open text editor in the application. An editor has a reference to its backing [TextDocument](https://docs.nova.app/api-reference/text-document) object. Text editors are not one-to-one to text documents, since multiple editors may be open for a single document. */
interface TextEditor {
	/** Returns `true` if the object provided is a `TextEditor` instance, otherwise returning `false`. This can be most useful for a [Commands](https://docs.nova.app/extensions/commands) handler function, which can receive either a [Workspace](https://docs.nova.app/api-reference/workspace) or `TextEditor` instance as its first argument. */
	static isTextEditor(object: any): boolean

	/** The [TextDocument](https://docs.nova.app/api-reference/text-document) object backing the editor. */
	readonly document: TextDocument

	/** The currently selected range, as a [Range](https://docs.nova.app/api-reference/range). If the receiver has multiple selected ranges, this will return the primary range (generally the first range). */
	selectedRange: Range

	/** An array of all currently selected ranges, as [Range](https://docs.nova.app/api-reference/range) objects. The ranges are guaranteed to be in ascending order, and have no intersections. */
	selectedRanges: Range[]

	/** The currently selected text, as a `String`. If the receiver has multiple selected ranges, this will return the text for the primary range (as returned by `selectedRange`). */
	readonly selectedText: string

	/** Whether the editor is set to use soft tabs (spaces). */
	softTabs: boolean

	/** The number of spaces used as a single tab length. */
	tabLength: number

	/** A `String` representation of a single tab in the editor’s preferred indentation style and tab width. */
	readonly tabText: string

	/**
	 * Begins an atomic edit session for the editor.
	 *
	 * The first argument must be a callable that will be invoked immediately to collect changes. The caller is responsible for doing all work in the callback it intends to represent a “single” operation on the undo stack.
	 *
	 * The callback will receive as an argument a [TextEditorEdit](https://docs.nova.app/api-reference/text-editor-edit) object that can be used to queue changes for the edit operation.
	 *
	 * This method returns a `Promise` object that resolves when the edit operation is either accepted or rejected by the editor. The editor may reject an edit operation if, for example, the extension has taken too long to queue changes such that editor responsiveness may be impacted.
	 * @throws It is a programming error to invoke this method from within a text change callback (such as one registered using `onDidChange()`). Attempting to do so will throw an `Error`.
	 */
	edit(callback: (edit: TextEditorEdit) => void, options?: unknown): Promise<void>
	// TODO: Options not documented

	/**
	 * Shorthand for inserting text quickly at the editor’s current insertion point(s). If there is any selection, it will be replaced by the provided text. Multiple calls to `insert()` within the same function will not be coalesced into one undo operation. To coalesce changes into a single undo operation, use the `edit()` API.
	 *
	 * This method returns a `Promise` object that resolves when the insert operation is either accepted or rejected by the editor. The editor may reject an insert operation if, for example, the extension has taken too long to queue changes such that editor responsiveness may be impacted.
	 *
	 * **The format argument was added in Nova 1.2.**
	 * @throws It is a programming error to invoke this method from within a text change callback (such as one registered using `onDidChange()`). Attempting to do so will throw an `Error`.
	 */
	insert(string: string, format?: InsertTextFormat): Promise<void>

	/**
	 * Requests that the editor be saved. For unsaved documents, this will present a modal save panel to the user requesting that a path be chosen.
	 *
	 * This method returns a `Promise` object that resolves when the save operation is finished, or rejects if the save operation failed.
	 */
	save(): Promise<void>

	/**
	 * Returns a section of the document’s text indicated by a provided [Range](https://docs.nova.app/api-reference/range) as a `String`.
	 *
	 * This is a convenience method that is effectively the same as invoking `getTextInRange(range)` on the editor’s document.
	 * @throws If the range exceeds the receiver’s bounds, an `Error` will be thrown.
	 */
	getTextInRange(range: Range): string

	/**
	 * Given a [Range](https://docs.nova.app/api-reference/range), this method will return the range of all lines encompassing that range.
	 *
	 * This is a convenience method that is effectively the same as invoking `getLineRangeForRange(range)` on the editor’s document.
	 * @throws If the range exceeds the receiver’s bounds, an `Error` will be thrown.
	 */
	getLineRangeForRange(range: Range): Range

	/**
	 * Adds an event listener that invokes the provided `callback` when the editor’s text changes. The callback will receive as an argument the `TextEditor` object.
	 *
	 * **Note:** This callback is potentially invoked very often as text changes. If you would like to perform actions in response to a user pausing after typing, consider the `onDidStopChanging()` event handler instead.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidChange<T>(callback: (this: T, editor: TextEditor) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` a short time after the editor stops changing. Multiple changes to text in a short time will be coalesced into one event that can be acted upon performantly. The callback will receive as an argument the `TextEditor` object.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidStopChanging<T>(callback: (this: T, editor: TextEditor) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` just before the editor is saved. The callback will receive as an argument the `TextEditor` object. If the callback performs modifications to the editor within the callback (such as with `edit()`), they will be applied in such a way as to include them in the pending save operation.
	 *
	 * This method may return a `Promise` object to denote to the runtime that changes need to be performed asynchronously. The IDE will wait for the promise to resolve or reject as part of its wait time.
	 *
	 * If a callback registered using this method (or a promise returned from it) takes too long to perform operations, any edits enqueued may be deferred until after the save operation, or discarded entirely. In the case they are discarded, an error will be reported from the `Promise` object returned from `edit()`. The exact amount of time may vary, but the runtime guarantees that it will allow at least 5 seconds for all extensions to perform their operations.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onWillSave<T>(callback: (this: T, editor: TextEditor) => void | Promise<void>, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the editor is saved. The callback will receive as an argument the `TextEditor` object.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidSave<T>(callback: (this: T, editor: TextEditor) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the editor’s selected ranges change. The callback will receive as an argument the `TextEditor` object.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidChangeSelection<T>(callback: (this: T, editor: TextEditor) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the editor is being closed. The callback will receive as an argument the `TextEditor` object.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidDestroy<T>(callback: (this: T, editor: TextEditor) => void, thisValue?: T): Disposable

	/**
	 * Moves the editor’s selected ranges upward a specific number of rows. If no row count parameter is provided, the selection will be moved one row.
	 * @since 5.0
	 */
	moveUp(rowCount?: number): void

	/**
	 * Moves the editor’s selected ranges downward a specific number of rows. If no row count parameter is provided, the selection will be moved one row.
	 * @since 5.0
	 */
	moveDown(rowCount?: number): void

	/**
	 * Moves the editor’s selected ranges leftward a specific number of columns. If no column count parameter is provided, the selection will be moved one column.
	 * @since 5.0
	 */
	moveLeft(columnCount?: number): void

	/**
	 * Moves the editor’s selected ranges rightward a specific number of columns. If no column count parameter is provided, the selection will be moved one column.
	 * @since 5.0
	 */
	moveRight(columnCount?: number): void

	/**
	 * Moves the editor’s selected range to the top of the document, before the first character.
	 * @since 5.0
	 */
	moveToTop(): void

	/**
	 * Moves the editor’s selected range to the end of the document, after the last character.
	 * @since 5.0
	 */
	moveToBottom(): void

	/**
	 * Moves the editor’s selected ranges to the beginning of each line containing them.
	 * @since 5.0
	 */
	moveToBeginningOfLine(): void

	/**
	 * Moves the editor’s selected ranges to the end of each line containing them.
	 * @since 5.0
	 */
	moveToEndOfLine(): void

	/**
	 * Moves the editor’s selected ranges to the beginning of the word containing or against the start of each range.
	 * @since 5.0
	 */
	moveToBeginningOfWord(): void

	/**
	 * Moves the editor’s selected ranges to the beginning of the word containing or against the end of each range.
	 * @since 5.0
	 */
	moveToEndOfWord(): void

	/** Adds the provided [Range](https://docs.nova.app/api-reference/range) to the editor’s selected ranges, automatically coalescing any overlapping ranges. If the provided range is zero-length, the range will be added as a cursor. */
	addSelectionForRange(range: Range): void

	/** Extends the editor’s primary selected range to the provided character position. */
	selectToPosition(position: number): void

	/** Extends the editor’s primary selected range upward a specific number of lines. If no row count parameter is provided, the selection will be extended one row. */
	selectUp(rowCount?: number): void

	/** Extends the editor’s primary selected range downward a specific number of lines. If no row count parameter is provided, the selection will be extended one row. */
	selectDown(rowCount?: number): void

	/** Extends the editor’s primary selected range leftward a specific number of characters. If no column count parameter is provided, the selection will be extended one column. */
	selectLeft(columnCount?: number): void

	/** Extends the editor’s primary selected range rightward a specific number of characters. If no column count parameter is provided, the selection will be extended one column. */
	selectRight(columnCount?: number): void

	/** Extends the editor’s primary selected range to the beginning of the text. */
	selectToTop(): void

	/** Extends the editor’s primary selected range to the end of the text. */
	selectToBottom(): void

	/** Selects all text in the editor. */
	selectAll(): void

	/** Extends all selected ranges and cursors to encompass all lines in which they intersect. */
	selectLinesContainingCursors(): void

	/** Extends all selected ranges and cursors backward to the beginning of their first (or only) line. */
	selectToBeginningOfLine(): void

	/** Extends all selected ranges and cursors forward to the end of their last (or only) line. */
	selectToEndOfLine(): void

	/** Extends all selected ranges and cursors to encompass all words in which they intersect. */
	selectWordsContainingCursors(): void

	/** Extends all selected ranges and cursors backward to the beginning of their first (or only) word. */
	selectToBeginningOfWord(): void

	/** Extends all selected ranges and cursors forward to the end of their last (or only) word. */
	selectToEndOfWord(): void

	/** Scrolls the editor to ensure that the primary selected range is visible. */
	scrollToCursorPosition(): void

	/** Scrolls the editor to ensure that the provided character position is visible. */
	scrollToPosition(position: number): void

	/**
	 * Begins a shadow typing session for the editor with a set of ranges. The ranges provided will be added as selected text ranges (or cursors, if zero-length) in the editor in a similar way to adding them to the `selectedRanges` property. However, the ranges will only remain valid while typing text in the current undo coalescing state. If the selection or undo state changes by any other means (such as by moving the cursors manually or saving the document), the ranges will be removed and the shadow typing session will end.
	 *
	 * The optional `charset` argument may be provided with a [Charset](https://docs.nova.app/api-reference/charset) object. As the user types, the characters will be compared with this character set. If a character does not match, the shadow typing session will end automatically.
	 */
	startShadowTyping(ranges: Range[], charset?: Charset): void

	/** Explicitly ends the current shadow typing session, if any. It’s generally not required to invoke this manually except in very specific circumstances that the shadow typing session’s attribute (such as its charset) cannot handle. */
	endShadowTyping(): void

	/** Gets the deepest displayable symbol containing the provided text position, as a [Symbol](https://docs.nova.app/api-reference/symbol) object. If no symbol could be found, this method returns `null`. */
	symbolAtPosition(position: number): Symbol | null

	/** Gets the deepest displayable symbol for the start position of each of the selected ranges of the editor, as an array of [Symbol](https://docs.nova.app/api-reference/symbol) objects. If no symbol could be found at a specific position, the array will contain a `null` entry for that range. */
	symbolsForSelectedRanges()
}

/// https://docs.nova.app/api-reference/text-editor-edit/

/** Enumeration defining in what format the text provided should be parsed. */
declare enum InsertTextFormat {
	/** The text is plain text and will not be modified (the default value). */
	PlainText,

	/** The text uses the [Snippets](https://docs.nova.app/extensions/snippets/) format and will be parsed for editor placeholders. */
	Snippet
}

/**
 * A `TextEditorEdit` object is used to queue changes within a call to a [TextEditor](https://docs.nova.app/api-reference/text-editor)’s `edit()` method. Multiple calls to an edit’s methods will be performed atomically to the editor as one operation on the undo stack.
 *
 * Changes are incurred in the order in which they are invoked on the `TextEditorEdit` object. As such, ranges provided to successive calls must ensure they take into account changes in character positions and ranges due to previous edits in the operation.
 */
interface TextEditorEdit {
	/** Deletes text in the the provided [Range](https://docs.nova.app/api-reference/range). */
	delete(range: Range): void

	/**
	 * Replaces text in the the provided [Range](https://docs.nova.app/api-reference/range) with a new text string. This method differs from `insert()` in that it will not move the cursor.
	 *
	 * The third argument provided, format, is an `InsertTextFormat` enumeration value defining in what format the text provided should be parsed. **This argument was added in Nova 5.**
	 * Supported values are:
	 * - InsertTextFormat.PlainText: The text is plain text and will not be modified (the default value).
	 * - InsertTextFormat.Snippet: The text uses the Snippets format and will be parsed for editor placeholders.
	 */
	replace(range: Range, text: string, format?: InsertTextFormat): void

	/**
	 * Inserts text at the provided character position (`Number`). This method differs from `replace()` in that it will automatically move the cursor.
	 *
	 * The third argument provided, `format`, is an `InsertTextFormat` enumeration value defining in what format the text provided should be parsed. **This argument was added in Nova 5.**
	 * Supported values are:
	 * - InsertTextFormat.PlainText: The text is plain text and will not be modified (the default value).
	 * - InsertTextFormat.Snippet: The text uses the Snippets format and will be parsed for editor placeholders.
	 */
	insert(position: number, text: string, format?: InsertTextFormat): void
}

/// https://docs.nova.app/api-reference/tree-data-provider/

/**
 * A `TreeDataProvider` interface should be implemented by objects that provide data to a [TreeView](https://docs.nova.app/api-reference/tree-view).
 *
 * The elements provided as data objects by a `TreeDataProvider` may be any valid JavaScript object.
 * @example
 * interface TreeDataProvider {
 *   getChildren(element);
 *   getParent(element);
 *   getTreeItem(element);
 * }
 */
interface TreeDataProvider<E> {
	/** Returns an array of children for an element (or a `Promise` that resolves to it). The `element` will be `null` for the root of the tree. */
	getChildren(element: E | null): E[] | Promise<E[]>

	/** Returns the parent of an element. This is an optional method used for the `TreeView` `reveal()` API. */
	getParent(element: E): E | null

	/** Returns the [TreeItem](https://docs.nova.app/api-reference/tree-item) representation of an element. */
	getTreeItem(element: E): TreeItem
}

/// https://docs.nova.app/api-reference/tree-item/

declare enum TreeItemCollapsibleState {
	/** The item cannot be expanded (it is a leaf item). */
	None,

	/** The item can be expanded, but is collapsed by default. */
	Collapsed,

	/** The item can be expanded, and is expanded by default. */
	Expanded
}

/**
 * A `TreeItem` object is the visual representation of an element represented within the dataset of a [TreeView](https://docs.nova.app/api-reference/tree-view). Tree items define attributes such as the element’s label, description, and icon.
 *
 * The `TreeItem` class is not subclassable.
 * @example
 * let item = new TreeItem("image.png", TreeItemCollapsibleState.None);
 *
 * item.descriptiveText = "PNG file";
 * item.path = "path/to/image.png";
 */
declare class TreeItem {
	/** Creates a new `TreeItem` object. The collapsibleState argument defaults to `TreeItemCollapsibleState.None`. */
	constructor(name: string, collapsibleState?: TreeItemCollapsibleState)

	/** The display name of the item, as a `string`. */
	name: string

	/** Defines how an item is displayed with regards to being expanded. The default value is `TreeItemCollapsibleState.None`, which indicates the item cannot be expanded. */
	collapsibleState: TreeItemCollapsibleState

	/** An optional [Command](https://docs.nova.app/extensions/commands) to invoke when the item is double-clicked. */
	command?: string

	/**
	 * When set to a [Color](https://docs.nova.app/api-reference/color) object, the color will be rendered as a swatch in the item’s row in place of its image.
	 *
	 * If both `image` and `color` are set on a tree item, the image will take priority.
	 */
	color?: Color

	/** A value used when validating the `when` clause of commands for the tree view. This value may be used for when clauses of the form `viewItem == '<contextValue>'`. */
	contextValue?: string

	/** A short description of the item, as a `string`. This will be displayed alongside the item’s label, if space allows. */
	descriptiveText?: string

	/** An optional unique identifier for the item, as a `string`. This identifier must be unique across the entire tree. This will be used to preserve selection and expansion state. */
	identifier?: string

	/**
	 * The name of an image to show for the item (see [Images](https://docs.nova.app/extensions/images) for more information).
	 *
	 * If both `image` and `color` are set on a tree item, the image will take priority.
	 */
	image?: string

	/** The file-system path to the item as a `string`, if appropriate. If this is specified, and `image` is not defined, the image will by default use the appropriate file-type image for this path. */
	path?: string

	/** A tooltip to display when hovering over the item, as a `string`. */
	tooltip?: string
}

/// https://docs.nova.app/api-reference/tree-view/

/**
 * A `TreeView` object acts as the interface to working with a custom extension sidebar using a tree style (an outline of objects with disclosure buttons). When you define a tree sidebar, you also create a `TreeView` object to provide data and respond to events for that sidebar.
 *
 * The `TreeView` class is not subclassable.
 * @implements {Disposable}
 * @example
 * // Create the TreeView
 * let treeView = new TreeView("my-identifier", {
 *   dataProvider: new MyDataProvider()
 * });
 *
 * treeView.onDidChangeSelection((selection) => {
 *   console.log("New selection: " + selection.map((e) => e.name));
 * });
 *
 * treeView.onDidExpandElement((element) => {
 *   console.log("Expanded: " + element.name);
 * });
 *
 * treeView.onDidCollapseElement((element) => {
 *   console.log("Collapsed: " + element.name);
 * });
 *
 * treeView.onDidChangeVisibility(() => {
 *   console.log("Visibility Changed");
 * });
 */
declare class TreeView<E> extends Disposable {
	/** Creates a new `TreeView` object. The `identifier` argument should match the identifier specified for a sidebar section in your extension’s `extension.json` file. */
	constructor(identifier: string, options?: {
		/** Object that provides data to the tree (see [TreeDataProvider](https://docs.nova.app/api-reference/tree-data-provider)). */
		dataProvider?: TreeDataProvider<E>
	})

	/** Whether the tree view is currently visible. */
	readonly visible: boolean

	/** An array of elements that are currently selected within the tree view. */
	readonly selection: ReadonlyArray<E>

	/**
	 * Adds an event listener that invokes the provided `callback` when the tree view’s selection change. The callback will receive as an argument the array of selected elements.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidChangeSelection<T>(callback: (this: T, selectedElements: E[]) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the tree view’s visibility change.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidChangeVisibility<T>(callback: (this: T) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the an element is expanded. The callback will receive as an argument the element that was expanded.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidExpandElement<T>(callback: (this: T, element: E) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the an element is collapsed. The callback will receive as an argument the element that was collapsed.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidCollapseElement<T>(callback: (this: T, element: E) => void, thisValue?: T): Disposable

	/**
	 * Causes the tree view to reload the specified element (if it is visible) and any descendants. Invoke this method with no argument (or with a `null` or `undefined` argument) to reload the entire tree view. Returns a `Promise` object that resolves when the reload has finished.
	 */
	reload(element?: E | null): Promise<void>

	/** Attempts to reveal the element in the tree. */
	reveal(element: E, options?: {
		/** Whether the element should be selected (default is `true`). */
		select?: boolean

		/** Whether the scroll view of the tree should be scrolled to make the element visible (default is `false`). */
		focus?: boolean

		/** The number of ancestors to attempt to expand to reveal the element (up to a maximum of 3). */
		reveal?: number
	}): void
}

/// https://docs.nova.app/api-reference/web-apis/

// TODO: Finish WEB APIs

declare function atob(data: string): string
declare function btoa(data: string): string

type TimerHandler = string | Function

declare function setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number
declare function clearTimeout(handle?: number): void

declare function setInterval(handler: TimerHandler, timeout?: number, ...arguments: any[]): number
declare function clearInterval(handle?: number): void

/// https://docs.nova.app/api-reference/workspace/

/**
 * A `Workspace` contains properties and methods related to an open workspace window. Extensions are loaded on a per-workspace basis, so there is generally only one workspace object available from the perspective of executing extension code.
 *
 * An instance representing the current workspace is always available via the `workspace` property of the global `nova` [Environment](https://docs.nova.app/api-reference/environment) object.
 */
interface Workspace {
	/** The `TextEditor` instance that is currently focused in the workspace. This may be `null` if no text editor is focused. */
	readonly activeTextEditor: TextEditor | null

	/**
	 * The [Configuration](https://docs.nova.app/api-reference/configuration) object for the workspace, written into the workspace’s internal metadata folder.
	 *
	 * Extensions may store values in this configuration that should be written into a per-workspace storage, and potentially stored in source control by the user.
	 */
	readonly config: Configuration

	/**
	 * An array of [DebugSession](https://docs.nova.app/api-reference/debug-session) objects which are running for the workspace.
	 * @since 9.0
	 */
	readonly debugSessions: ReadonlyArray<DebugSession>

	/** Returns the workspace’s path on disk, as a `String`. If the workspace is not bound to a folder this may be `null` or `undefined`. */
	readonly path?: string | null

	/**
	 * The root path of the workspace’s preview. This path represents the directory being served at the root of previews. This property will return `null` or `undefined` in cases where previewing is not available for the workspace.
	 * @since 9.0
	 */
	readonly previewRootPath?: string | null

	/**
	 * The computed URL for the workspace’s preview as a `String`. If the workspace is using Nova’s built-in web server this property will represent that server’s root. If the workspace has a custom preview URL set by the user this property will represent that URL. This method will return `null` or `undefined` in cases where previewing is not available for the workspace.
	 * @since 9.0
	 */
	readonly previewURL?: string | null

	/** An array of [TextDocument](https://docs.nova.app/api-reference/text-document) objects representing each document open in the workspace. Text Documents are not necessarily one-to-one with the `textEditors` properties, as multiple editors can be opened for a single text document. */
	readonly textDocuments: ReadonlyArray<TextDocument>

	/** An array of [TextEditor](https://docs.nova.app/api-reference/text-editor) objects representing each text editor open in the workspace. Text Editors are not necessarily one-to-one with the `textDocuments` properties, as multiple editors can be opened for a single document. */
	readonly textEditors: ReadonlyArray<TextEditor>

	/** Returns `true` if the workspace contains the file at a specified path. If the workspace is not bound to a folder, this method always returns `false`. */
	contains(path: string): boolean

	/**
	 * Adds an event listener that invokes the provided `callback` when the workspace opens a text editor. The callback will receive as an argument the [TextEditor](https://docs.nova.app/api-reference/text-editor) object.
	 *
	 * As a convenience, when this method is invoked the callback will also immediately be called with all open text editors.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidAddTextEditor<T>(callback: (this: T, editor: TextEditor) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the workspace’s path changes. The callback will receive as an argument the new path as a string.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidChangePath<T>(callback: (this: T, newPath: string) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the workspace ends a debug session. The callback will receive as an argument the [DebugSession](https://docs.nova.app/api-reference/debug-session) object.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 * @since 9.0
	 */
	onDidEndDebugSession<T>(callback: (this: T, debugSession: DebugSession) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the workspace opens a text document. The callback will receive as an argument the [TextDocument](https://docs.nova.app/api-reference/text-document) object.
	 *
	 * As a convenience, when this method is invoked the callback will also immediately be called with all open text documents.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 */
	onDidOpenTextDocument<T>(callback: (this: T, document: TextDocument) => void, thisValue?: T): Disposable

	/**
	 * Adds an event listener that invokes the provided `callback` when the workspace starts a debug session. The callback will receive as an argument the [DebugSession](https://docs.nova.app/api-reference/debug-session) object.
	 *
	 * The optional `thisValue` argument may be used to set what `this` is bound to when the callable is invoked. If omitted, `this` will be `undefined`.
	 * @since 9.0
	 */
	onDidStartDebugSession<T>(callback: (this: T, debugSession: DebugSession) => void, thisValue?: T): Disposable

	/** Requests the workspace open the project settings view for a specified extension, by identifier. If no identifier is specified, the current extension’s project settings will be opened. */
	openConfig(identifier?: string): void

	/** Requests the workspace open a file by URI. For local files, this can be either a file:// URI or a path on disk. Returns a `Promise` object that, on success, resolves to the new editor’s object (usually a [TextEditor](https://docs.nova.app/api-reference/text-editor) object), or `null` if the editor does not expose extension API. */
	openFile(uri: string, options?: {
		/** Line number to jump to after opening. */
		line?: number,

		/** Column number to jump to after opening (requires `line`). */
		column?: number
	}): Promise<TextEditor> | null

	/** Requests the workspace open a new, untitled document tab. */
	openNewTextDocument(options?: {
		/** The content of the new document, if any. */
		content?: string

		/** Line number to jump to after opening. */
		line?: number

		/** Column number to jump to after opening (requires `line`). */
		column?: number

		/** The identifier for a syntax to set for the document. If not specified, the user’s default syntax will be used. */
		syntax: string
	})

	/**
	 * Returns a `String` representing the URL for previewing the file at the specified path. This method will return `null` or `undefined` in cases where previewing is not available for the workspace or if the specified file is not within the directory tree being served by the workspace’s preview.
	 * @since 9.0
	 */
	previewURLForPath(path: string): string | null | undefined

	/** Converts an absolute path into a path relative to the workspace root. If the provided path is not a descendant of the workspace root then relative prefix components (`../`) will be applied as necessary to create a relative path. If the workspace is not bound to a folder this method returns the path unchanged. */
	relativizePath(path): string

	/**
	 * Requests that the IDE reload tasks from the [task assistant](https://docs.nova.app/api-reference/assistants-registry) with the provided identifier. This will cause the IDE to invoke the `provideTasks()` method on the assistant asynchronously.
	 *
	 * If an assistant with the provided identifier is not registered this method has no effect.
	 */
	reloadTasks(identifier: string): void

	/**
	 * Displays an action panel to the user. The panel will be titled with the calling extension’s name, and the provided `message` will be displayed as the panel body.
	 *
	 * The optional `callback` argument should be a callable, which will be invoked when the user chooses a button in the alert. The callback will be passed the button index chosen (as a `Number`), or `null` if the alert was dismissed by other means (such as the application cancelling the alert without user intervention).
	 */
	showActionPanel(message: string, options?: {
		/**
		 * An array of strings, used as button names in the alert.
		 *
		 * If not specified, a single “OK” button will be included.
		 */
		buttons?: string[]
	}, callback?: (buttonIndex: number | null) => void): void

	/**
	 * Displays a choice palette to the user (in the style of the command palette). The provided array of strings, `choices`, will be displayed as the initial results of the palette, and can be filtered by the user by typing.
	 *
	 * The optional `callback` argument should be a callable, which will be invoked when the user confirms with the Return key. The callback will be passed the choice (from the `choices` array) selected by the user or `null` if the palette was cancelled, as well as optionally the index of the choice within the provided array as the second argument.
	 */
	showChoicePalette(choices: string[], options?: {
		/** Text to display if no value is present. */
		placeholder?: string
	}, callback?: (choice: string | null, choiceIndex: number | null) => void): void

	/** Displays an error message to the user as an alert. The alert will be titled with the calling extension’s name, and the provided `message` will be displayed as the alert body. This method is similar to `showInformativeMessage` except it includes additional UI indications that the message indicates an error, and may bring the workspace’s window to the foreground. */
	showErrorMessage(message: string): void

	/**
	 * Displays a file chooser panel to the user. The panel will be titled with the calling extension’s name, and the provided `message` will be displayed as the panel body.
	 *
	 * File chooser panels show a standard macOS open panel to request file(s) and folder(s) be selected by the user.
	 *
	 * The optional `callback` argument should be a callable, which will be invoked when the user dismisses the panel. The callback will be passed an array of paths chosen, or `null` if the alert was cancelled.
	 */
	showFileChooser(message: string, options?: {
		/** Text to display instead for the “OK” button. */
		prompt?: string

		/** Whether the user may choose files. */
		allowFiles?: boolean

		/** Whether the user may choose folders. */
		allowFolders?: boolean

		/** Whether the user may choose multiple files. */
		allowMultiple?: boolean

		/** The file types allowed, as an array of strings. Types may be file extensions or uniform type identifiers. */
		filetype?: string[]

		/** Whether to return paths to the caller which are relative to the workspace. */
		relative?: boolean
	}, callback?: (paths: string[] | null) => void): void

	/** Displays an informative message to the user as an alert. The alert will be titled with the calling extension’s name, and the provided `message` will be displayed as the alert body. */
	showInformativeMessage(message: string): void

	/**
	 * Displays an input palette to the user (in the style of the command palette). The provided `message` will be displayed as the palette’s descriptive text.
	 *
	 * Input palettes include a single text field to ask user for a value.
	 *
	 * The optional `callback` argument should be a callable, which will be invoked when the user confirms with the Return key. The callback will be passed the value provided by the user (as a `String`), or `null` if the palette was cancelled.
	 */
	showInputPalette(message: string, options?: {
		/** Text to display if no value is present. */
		placeholder?: string

		/**
		 * Text with which to pre-fill the palette.
		 * @since 4.0
		 */
		value?: string
	}, callback?: (value: string | null) => void): void

	/**
	 * Displays an input panel to the user (in the style of a modal sheet). The panel will be titled with the calling extension’s name, and the provided `message` will be displayed as the panel body.
	 *
	 * Input panels include a single text field to ask user for a value, as well as two buttons (“Cancel” and “OK”).
	 *
	 * The optional `callback` argument should be a callable, which will be invoked when the user chooses a button in the alert. The callback will be passed the value provided by the user (as a `String`), or `null` if the alert was cancelled.
	 */
	showInputPanel(message: string, options?: {
		/** Label to display before the input field. */
		label?: string

		/** Text to display if no value is present. */
		placeholder?: string

		/** Default value to display. */
		value?: string

		/** Text to display instead for the “OK” button. */
		prompt?: string

		/** Whether the field should be “secure” (display its value using dots). */
		secure?: boolean
	}, callback?: (value: string | null) => void): void

	/** Displays a warning message to the user as an alert. The alert will be titled with the calling extension’s name, and the provided `message` will be displayed as the alert body. This method is similar to `showInformativeMessage` except it includes additional UI indications that the message indicates a warning, and may bring the workspace’s window to the foreground. */
	showWarningMessage(message: string): void
}
