const enUS = Object["freeze"]({
  'app': Object["freeze"]({
    'documentTitle': "Canvas AI",
    'starting': "Canvas AI is starting",
    'serverDisconnected': '⚠️\x20The\x20local\x20service\x20is\x20temporarily\x20unavailable.\x20Some\x20features\x20may\x20not\x20work\x20while\x20the\x20app\x20reconnects.\x20If\x20this\x20persists,\x20quit\x20and\x20reopen\x20Canvas\x20AI.',
    'quickGenerate': "Canvas AI Agent",
    'debugSandbox': "V2 architecture sandbox · Drag nodes to test",
    'canvasArea': "Canvas area",
    'canvasShortcuts': "Shortcuts",
    'sourceDefaults': Object["freeze"]({
      'image': "Image",
      'video': "Video",
      'audio': "Audio",
      'text': "Text",
      'node': "Node"
    }),
    'globalScreenshot': Object["freeze"]({
      'reverseNodeName': "Image to prompt",
      'reverseCreated': "Screenshot and prompt node added. Generate when ready.",
      'reverseStarted': "Image prompt node created. Generating...",
      'reverseFailed': "Prompt node kept. Check the model, image input and settings, then generate manually.",
      'nodeName': "Global screenshot",
      'added': "Screenshot added to canvas",
      'importFailed': "Failed to add screenshot to canvas",
      'shortcutRegistrationFailed': "Global {accelerator} registration failed. You can still use {accelerator} inside the app.",
      'captureFailed': 'Global\x20screenshot\x20failed.\x20Check\x20screen\x20recording\x20permission\x20or\x20try\x20again\x20later.'
    }),
    'globalTextPreset': Object['freeze']({
      'noSelectedText': 'No\x20selected\x20text\x20was\x20found.\x20Select\x20text,\x20then\x20use\x20the\x20shortcut\x20again.',
      'defaultMissing': "No default preset tab is set. Text presets opened temporarily; right-click a tab to star it.",
      'openFailed': 'Failed\x20to\x20open\x20user\x20presets.\x20Try\x20again\x20later.',
      'shortcutRegistrationFailed': "Global {accelerator} registration failed. Choose another shortcut in settings."
    }),
    'globalCapture': Object['freeze']({
      'unsupportedAction': "This canvas action is not supported yet.",
      'preparingGeneration': "Creating the node and preparing generation",
      'nodeAdded': "Added to the current canvas",
      'actionFailed': "Failed to add to canvas: {reason}",
      'generationFailed': "The node was created, but generation could not start: {reason}",
      'generationStarted': "Node created and generation started",
      'nodeNames': Object["freeze"]({
        'sourceText': 'Globally\x20selected\x20text',
        'aiText': "Selected text · AI text",
        'aiImage': 'Selected\x20text\x20·\x20AI\x20image',
        'aiVideo': 'Selected\x20text\x20·\x20AI\x20video'
      })
    }),
    'nodeLabel': Object["freeze"]({
      'renameTooltip': "Click to rename"
    })
  }),
  'appShell': Object["freeze"]({
    'compatibilityModeBadge': 'Compatibility\x20mode',
    'currentVersionBadge': "Current version: V{version}"
  }),
  'selectionMediaProperties': Object["freeze"]({
    'ariaLabel': "Selected node properties",
    'image': "Image",
    'video': "Video",
    'audio': "Audio",
    'text': 'Text',
    'fields': Object["freeze"]({
      'dimensions': "Dimensions",
      'duration': 'Duration',
      'fps': "Frame rate",
      'frames': "Frames",
      'characters': 'Characters'
    }),
    'values': Object["freeze"]({
      'seconds': "{value} sec",
      'frames': "{value} frames",
      'framesApproximate': 'About\x20{value}\x20frames'
    })
  }),
  'common': Object["freeze"]({
    'close': "Close"
  }),
  'appBusinessEvents': Object["freeze"]({
    'copyMedia': Object["freeze"]({
      'selectSingleImageNode': 'Select\x20one\x20image\x20node',
      'copied': 'Image\x20copied',
      'noMedia': "The current node has no media to copy",
      'clipboardUnsupported': 'System\x20clipboard\x20copy\x20is\x20not\x20supported\x20in\x20this\x20environment',
      'copyFailed': "Failed to copy image"
    }),
    'toggles': Object["freeze"]({
      'snapGuides': Object["freeze"]({
        'on': 'Guide\x20snapping\x20is\x20on',
        'off': "Guide snapping is off"
      }),
      'snapGrid': Object["freeze"]({
        'on': "Grid snapping is on",
        'off': "Grid snapping is off"
      }),
      'gridDots': Object["freeze"]({
        'on': "Grid dots are visible",
        'off': "Grid dots are hidden"
      }),
      'connectionLines': Object['freeze']({
        'on': "Connection lines are visible",
        'off': "Connection lines are hidden"
      }),
      'selectionRelatedHighlight': Object["freeze"]({
        'on': "Related-node highlight is on",
        'off': "Related-node highlight is off"
      }),
      'titleFollowsZoom': Object["freeze"]({
        'on': "Titles now follow canvas zoom",
        'off': 'Titles\x20no\x20longer\x20follow\x20canvas\x20zoom'
      }),
      'mediaNodeResize': Object["freeze"]({
        'on': "Image/video node resizing is on",
        'off': "Image/video node resizing is off"
      }),
      'promptBoxResize': Object["freeze"]({
        'on': "Prompt box resizing is on",
        'off': "Prompt box resizing is off"
      }),
      'nodeAvoidOverlap': Object["freeze"]({
        'on': "New-node overlap avoidance is on",
        'off': 'New-node\x20overlap\x20avoidance\x20is\x20off'
      })
    }),
    'nodeDefaults': Object["freeze"]({
      'sourceText': "Source text",
      'aiText': "Generated text",
      'aiImage': 'Generated\x20image',
      'aiVideo': "Generated video",
      'aiAudio': "Generated audio",
      'sceneDetection': 'Scene\x20detection'
    })
  }),
  'format': Object["freeze"]({
    'relativeTime': Object["freeze"]({
      'justNow': 'Just\x20now',
      'minuteOne': '{count}\x20minute\x20ago',
      'minute': "{count} minutes ago",
      'hourOne': "{count} hour ago",
      'hour': "{count} hours ago",
      'dayOne': "{count} day ago",
      'day': '{count}\x20days\x20ago',
      'weekOne': '{count}\x20week\x20ago',
      'week': "{count} weeks ago",
      'monthOne': "{count} month ago",
      'month': "{count} months ago",
      'yearOne': "{count} year ago",
      'year': "{count} years ago"
    })
  }),
  'project': Object["freeze"]({
    'newProject': "New project",
    'addCanvasPage': "New canvas page",
    'currentVersion': "Current version",
    'canvasProject': "Canvas projects",
    'canvasTitle': 'Canvas\x20AI',
    'loading': "Loading...",
    'newCanvas': "New canvas"
  }),
  'projectManager': Object["freeze"]({
    'defaultProjectName': 'Canvas\x20{date}',
    'newProjectFallback': "New project",
    'loadFailed': "Failed to read project",
    'loading': "Loading...",
    'newProject': "New project",
    'delete': "Delete",
    'confirm': Object['freeze']({
      'cancel': 'Cancel',
      'deleteConfirm': "Confirm delete"
    }),
    'deleteConfirm': Object["freeze"]({
      'title': "Confirm delete",
      'message': 'This\x20project\x20cannot\x20be\x20restored\x20after\x20deletion.\x20Continue?'
    })
  }),
  'canvasTabs': Object["freeze"]({
    'defaultCanvasName': "Default canvas",
    'newCanvasName': "Canvas {index}",
    'untitledCanvas': 'Untitled\x20canvas',
    'downloadedWorkflow': "Workflow downloaded: {filename}",
    'keepOneCanvas': 'Keep\x20at\x20least\x20one\x20canvas\x20page',
    'closeCanvas': "Close this canvas",
    'switchBlockedByTasks': "{count} task(s) on the current canvas cannot be resumed safely yet. Wait for a remote task ID or completion before switching.",
    'deleteBlockedByTasks': "This canvas still has generation tasks. Wait for them to finish or cancel them before deleting it.",
    'contextMenu': Object["freeze"]({
      'save': "Save",
      'saveAs': "Save as...",
      'collectProject': "Collect current project",
      'delete': "Delete"
    }),
    'deleteUnsaved': Object["freeze"]({
      'title': "Delete unsaved canvas?",
      'message': '\x22{name}\x22\x20has\x20unsaved\x20changes.\x20Deleting\x20it\x20will\x20discard\x20them.',
      'cancel': 'Cancel',
      'delete': 'Delete'
    })
  }),
  'projectDropdown': Object['freeze']({
    'unnamedCanvas': "Untitled canvas",
    'loadedPackageBase': "Loaded project package",
    'externalProject': 'External\x20project',
    'packageFallback': "Project package",
    'listSeparator': ',\x20',
    'listMore': "{items}, and {count} total",
    'elapsedSeconds': "{seconds}s elapsed",
    'elapsedMinutesSeconds': '{minutes}m\x20{seconds}s\x20elapsed',
    'packageProcessing': "Processing project package...",
    'collectingCurrentProject': "Collecting current project",
    'loadingProjectTitle': "Loading project",
    'loadingProjectDefault': "Loading project...",
    'readingLocalProject': 'Reading\x20local\x20project...',
    'renderingCanvas': "Rendering canvas...",
    'savingLocal': 'Saving\x20local\x20project\x20as...',
    'opened': 'Opened:\x20{name}',
    'openLocalFailed': "Failed to open local project",
    'saveAsSucceeded': 'Saved\x20as:\x20{filename}',
    'saveAsFailed': 'Save\x20as\x20failed',
    'readingProjectPackage': 'Reading\x20project\x20package...',
    'renderingProjectPackage': "Rendering project package...",
    'readingProjectData': "Reading project data...",
    'savingCurrentSession': "Saving the current project's recovery session...",
    'switchBlockedByTasks': "{count} task(s) in the current project cannot be resumed safely yet. Wait for a remote task ID or completion before switching.",
    'confirmExternalDirty': "The current canvas has unsaved changes.\n\nDiscard unsaved changes and open \"{filename}\"?",
    'externalOpenFailed': 'Failed\x20to\x20open\x20external\x20project',
    'loading': "Loading...",
    'emptyProjects': "No saved canvas projects",
    'confirm': 'Confirm',
    'cancel': "Cancel",
    'deleted': "Deleted",
    'deleteFailed': "Delete failed",
    'renamed': "Renamed: {name}",
    'renameFailed': 'Rename\x20failed',
    'nameExists': "Project name already exists",
    'renameAria': 'Rename\x20project\x20{name}',
    'listLoadFailed': "Loading failed. Confirm the server is running.",
    'loaded': "Loaded: {name}",
    'loadFailed': "Loading failed",
    'saveSucceeded': "Saved: {name}",
    'saveFailed': "Save failed",
    'newCanvasCreated': "New canvas created",
    'contextMenu': Object["freeze"]({
      'rename': "Rename",
      'delete': 'Delete'
    }),
    'actions': Object["freeze"]({
      'openLocal': "Open local project",
      'saveAsLocal': 'Save\x20as\x20local\x20project',
      'collectCurrent': "Collect current project",
      'loadPackage': 'Load\x20project\x20package'
    }),
    'packageExport': Object['freeze']({
      'missingLocalWithSummary': "Collection failed: missing local assets {summary}",
      'missingLocal': "Collection failed: local asset files referenced by this project do not exist",
      'remoteNotLocalizedWithSummary': "Collection failed: remote assets are not localized {summary}",
      'remoteNotLocalized': 'Collection\x20failed:\x20this\x20project\x20still\x20has\x20remote\x20assets\x20that\x20are\x20not\x20localized',
      'missingOriginalVideos': "{count} historical original videos are missing; existing derived assets were packaged",
      'failed': "Failed to collect current project",
      'collected': "Project package collected: {filename}",
      'collectedWithWarning': "Project package collected: {filename} ({warning})"
    }),
    'packageImport': Object["freeze"]({
      'loaded': "Project package loaded: {name}",
      'failed': "Failed to load project package"
    })
  }),
  'assetManager': Object["freeze"]({
    'title': 'Materials',
    'libraryTitle': "Material library",
    'back': 'Back',
    'close': "Close",
    'confirm': "Confirm",
    'cancel': "Cancel",
    'folders': "Folders",
    'favorites': 'Favorites',
    'newFolder': "New folder",
    'folderNamePlaceholder': "Folder name",
    'searchPlaceholder': "Search materials",
    'searchAria': "Search material library",
    'emptyFolder': "No materials in this folder",
    'emptyFavorites': "No favorite materials",
    'emptySearch': "No matching materials",
    'emptyLibrary': "The material library is empty",
    'loading': "Loading materials…",
    'reuseMaterial': "Reuse material {name} on canvas",
    'doubleClickMaterial': "Double-click or drag material {name} onto the canvas",
    'renameMaterialAria': "Rename material {name}",
    'expandFolder': "Expand folder {name}",
    'collapseFolder': "Collapse folder {name}",
    'expandMaterial': "Expand material {name}",
    'collapseMaterial': "Collapse material {name}",
    'copySuffix': " Copy",
    'deleteCategory': 'Delete\x20folder',
    'deleteCategoryAria': 'Delete\x20folder\x20{category}',
    'renameCategoryAria': "Rename folder {category}",
    'categoryLimit': "Up to {limit} categories",
    'categorySaveFailed': "Failed to save categories",
    'categoryNameExists': 'A\x20folder\x20with\x20this\x20name\x20already\x20exists',
    'categoryNameUnavailable': "This folder name is unavailable",
    'categoryRenamed': "Folder renamed",
    'categoryRenameFailed': "Failed to rename folder",
    'deleteFailed': "Delete failed",
    'categoryHasAssets': "This category still contains assets and cannot be deleted",
    'categoryDeleted': "Folder deleted",
    'categoryDeleteFailed': "Failed to delete folder",
    'thumbnailAlt': "Thumbnail",
    'coverAlt': "Cover",
    'loadToCanvas': "Load to canvas",
    'deleteAsset': "Delete asset",
    'unnamedAsset': "Untitled asset",
    'newAsset': "New asset",
    'assetAlt': "Asset",
    'unknownTime': "Unknown",
    'uncategorized': 'Uncategorized',
    'emptyCategory': "No {category} assets",
    'tabsPrevAria': "View categories to the left",
    'tabsNextAria': "View categories to the right",
    'categories': Object['freeze']({
      'people': 'Characters',
      'scenes': "Scenes",
      'objects': "Props",
      'styles': "Styles",
      'soundEffects': 'Sound\x20effects',
      'others': 'Others',
      'storyWorkspace': "Story Workspace",
      'replacementStudio': "Replacement Studio",
      'history': "Generation history",
      'custom': "Custom"
    }),
    'types': Object["freeze"]({
      'text': "Text",
      'audio': "Audio",
      'video': 'Video',
      'image': "Image",
      'other': 'Node'
    }),
    'createPanel': Object['freeze']({
      'createTitle': "Create asset",
      'saveTitle': "Save to material library",
      'updateTitle': 'Update\x20existing\x20asset',
      'createTab': "Create new asset",
      'updateTab': "Update existing asset",
      'create': "Create",
      'save': "Save",
      'creating': "Creating",
      'overwrite': "Overwrite",
      'confirmOverwrite': "Confirm overwrite",
      'saving': 'Saving',
      'join': 'Add',
      'joining': "Adding",
      'confirmOverwriteAsset': "Overwrite \"{name}\" with the current selection?",
      'searchAssets': "Search {category} assets",
      'noMatchedAssets': 'No\x20matching\x20existing\x20assets',
      'noCategoryAssets': "No {category} assets yet",
      'currentSelection': "Current selection",
      'selectedNodes': "{count} nodes",
      'assetName': 'Asset\x20name',
      'assetNamePlaceholder': "Enter asset name",
      'category': "Category",
      'categoryNamePlaceholder': "Category name",
      'folderListAria': "Choose a material folder"
    }),
    'errors': Object["freeze"]({
      'noSavableNodes': 'There\x20are\x20no\x20nodes\x20to\x20save',
      'selectAssetToUpdate': "Select an existing asset to update",
      'assetUpdateFailed': 'Failed\x20to\x20update\x20asset',
      'assetCreateFailed': 'Failed\x20to\x20create\x20asset',
      'noJoinableNodes': "There are no nodes to add",
      'selectAssetToJoin': 'Select\x20an\x20existing\x20asset\x20to\x20add\x20to',
      'assetJoinFailed': "Failed to add to asset",
      'nameRequired': "Name is required",
      'renameFailed': "Rename failed"
    }),
    'toasts': Object["freeze"]({
      'assetUpdated': "Asset updated",
      'assetCreated': 'Asset\x20created',
      'assetJoined': "Added to asset",
      'renamed': "Renamed",
      'subAssetAdded': "Sub-asset added to canvas",
      'assetAdded': 'Asset\x20added\x20to\x20canvas',
      'favoriteUpdated': 'Favorite\x20updated',
      'moved': "Material moved",
      'duplicated': "Material copy created",
      'deleted': "Material deleted"
    }),
    'detail': Object["freeze"]({
      'meta': '{category}\x20·\x20{count}\x20nodes\x20·\x20Updated\x20{time}',
      'content': "Contents",
      'empty': "This asset is empty",
      'childAssetName': "Sub-asset {index}"
    }),
    'menu': Object["freeze"]({
      'aria': 'Material\x20actions',
      'open': 'Open\x20more\x20actions\x20for\x20material\x20{name}',
      'favorite': "Favorite",
      'unfavorite': "Remove from favorites",
      'rename': "Rename",
      'moveTo': "Move to…",
      'duplicate': "Create copy",
      'download': "Download",
      'delete': "Delete",
      'confirmDelete': "Delete “{name}”?",
      'processing': "Working…",
      'noMoveTarget': 'No\x20other\x20folders',
      'noDownloadableMedia': 'This\x20material\x20has\x20no\x20downloadable\x20media',
      'downloadTitle': 'Download\x20material\x20“{name}”',
      'downloadFailed': 'Material\x20download\x20failed',
      'actionFailed': "Material action failed"
    })
  }),
  'sidebar': Object['freeze']({
    'toolbarLabel': 'Canvas\x20toolbar',
    'assets': "Materials",
    'workflows': 'Workflows',
    'rhAiApp': "Custom AI App",
    'files': 'Files',
    'nodeManager': "Node manager",
    'tasks': 'Tasks',
    'taskBeta': 'Tasks\x20beta',
    'pin': "Pin canvas toolbar",
    'autoHide': "Auto-hide canvas toolbar",
    'settings': "Settings"
  }),
  'nodeManager': Object["freeze"]({
    'title': "Node manager",
    'projectNameAria': "Canvas project name",
    'renameProjectAria': "Rename canvas project",
    'listAria': "Canvas node list",
    'listTitle': "Nodes",
    'search': 'Search\x20nodes',
    'searchPlaceholder': "Search nodes",
    'closeSearch': 'Close\x20search',
    'filter': "Filter nodes",
    'expandAll': 'Expand\x20all\x20groups',
    'collapseAll': 'Collapse\x20all\x20groups',
    'expandGroup': 'Expand\x20group\x20“{name}”',
    'collapseGroup': "Collapse group “{name}”",
    'collapsePanel': "Collapse node manager",
    'empty': "No matching nodes",
    'unnamed': "Untitled node",
    'groupCount': '{count}\x20nodes',
    'total': "{count} nodes total",
    'filters': Object["freeze"]({
      'all': 'All',
      'text': "Text",
      'video': "Video",
      'image': 'Image',
      'audio': "Audio"
    }),
    'actions': Object['freeze']({
      'menuAria': 'Actions\x20for\x20{name}',
      'more': 'More\x20actions',
      'rename': "Rename",
      'download': "Download",
      'delete': "Delete"
    }),
    'toasts': Object["freeze"]({
      'renameFailed': "Failed to rename node",
      'deleteFailed': "Failed to delete node",
      'projectRenameFailed': "Failed to rename project",
      'duplicateFailed': 'Failed\x20to\x20duplicate\x20node'
    })
  }),
  'settings': Object["freeze"]({
    'nav': Object['freeze']({
      'title': "Settings",
      'general': "General",
      'canvasAlign': "Canvas & Alignment",
      'nodeBehavior': "Node Creation & Behavior",
      'fileSave': "Files & Save",
      'apiInput': "Model Services",
      'objectStorage': 'Object\x20Storage',
      'cliLogin': "CLI Login",
      'subscription': 'Subscription',
      'shortcuts': "Keyboard Shortcuts"
    }),
    'menu': Object["freeze"]({
      'settings': "Settings",
      'tutorial': "Tutorial",
      'checkForUpdates': "Check for Updates",
      'githubOfficial': 'GitHub',
      'featureFeedback': "Feedback",
      'feedbackGroup': 'Feedback\x20/\x20Community',
      'about': 'About',
      'openGithub': 'Open\x20the\x20official\x20GitHub\x20repository',
      'openFeedback': "Open feature feedback",
      'openFeedbackGroup': "Open feedback/community group"
    }),
    'feedbackGroup': Object["freeze"]({
      'title': "Feedback / Community",
      'qrAlt': "Feedback/community group QR code",
      'qrLoadFailed': "QR code failed to load. You can copy the WeChat ID instead.",
      'desc': "If the QR code expires, please reach us through the in-app feedback channel."
    }),
    'language': Object["freeze"]({
      'label': "Language",
      'desc': "Choose the interface language. Changes apply immediately.",
      'selectAria': "Choose interface language",
      'options': Object["freeze"]({
        'zh-CN': '简体中文',
        'en-US': "English"
      })
    }),
    'common': Object["freeze"]({
      'on': 'On',
      'off': 'Off',
      'close': 'Close\x20settings',
      'shortcut': "Shortcut:"
    }),
    'search': Object['freeze']({
      'placeholder': "Search settings",
      'title': "Search settings",
      'count': '{count}\x20setting\x20groups\x20found.\x20Edit\x20them\x20below.',
      'empty': "No matching settings"
    }),
    'saveStatus': Object["freeze"]({
      'auto': "Changes save automatically",
      'scheduled': 'Waiting\x20to\x20save…',
      'saving': "Saving…",
      'saved': 'Saved',
      'error': "Save failed. Click Save to retry"
    }),
    'completionSound': Object['freeze']({
      'saved': 'Completion\x20sound\x20settings\x20saved',
      'saveFailed': 'Failed\x20to\x20save\x20completion\x20sound\x20settings:\x20{error}',
      'listUnsupported': "This environment cannot read the system sound folder",
      'readingSystemSounds': "Reading system sound folder...",
      'foundMp3Files': "Found {count} mp3 files",
      'emptyMp3Directory': "No mp3 files in this folder",
      'listFailed': "Failed to read system sound folder: {error}",
      'openFolderUnsupported': "This environment cannot open the system sound folder",
      'openFolderFailed': "Failed to open system sound folder: {error}",
      'loadFailed': "Failed to load completion sound settings",
      'unknownError': "Unknown error"
    }),
    'general': Object["freeze"]({
      'collaboration': Object["freeze"]({
        'title': 'Collaboration',
        'offscreenLabel': "Show offscreen members",
        'offscreenDesc': "Show names and directions at the canvas edge when member cursors are outside your view",
        'attentionLabel': "Allow host to guide your view",
        'attentionDesc': "Move to the host's current view when invited, without continuously following"
      }),
      'title': "General",
      'appearance': 'Appearance',
      'layout': 'Toolbars\x20and\x20panels',
      'inputPreferences': 'Input\x20Preferences',
      'imageInput': "Image Input",
      'download': 'Downloads',
      'downloadUseOriginalFilename': Object["freeze"]({
        'label': "Use original filenames for downloads",
        'desc': 'Use\x20the\x20original\x20image,\x20video\x20or\x20audio\x20filename\x20when\x20enabled;\x20otherwise\x20use\x20the\x20node\x20name.\x20If\x20no\x20original\x20filename\x20is\x20available,\x20use\x20the\x20node\x20name.'
      }),
      'videoPlayback': 'Video\x20Playback',
      'completionNotifications': "Completion Notifications",
      'theme': Object["freeze"]({
        'label': "App theme",
        'desc': 'Switch\x20the\x20overall\x20light\x20or\x20dark\x20interface\x20style',
        'dusk': "Dusk",
        'dawn': "Dawn",
        'day': 'Day'
      }),
      'promptActionSurface': Object["freeze"]({
        'label': "Prompt and action bar surface",
        'desc': "Controls the background style of node prompt bars and floating action bars",
        'transparent': "Transparent",
        'themed': 'Frosted'
      }),
      'canvasToolbarPlacement': Object["freeze"]({
        'label': 'Canvas\x20toolbar\x20position',
        'desc': "Show the primary toolbar on the left, right, or centered along the bottom",
        'left': "Left",
        'right': "Right",
        'bottom': 'Bottom'
      }),
      'nodeManagerPlacement': Object['freeze']({
        'label': "Node manager position",
        'desc': "Show the node manager on the left, right, or bottom of the canvas",
        'left': "Left",
        'right': "Right",
        'bottom': 'Bottom'
      }),
      'leftSidebarAutoHide': Object["freeze"]({
        'label': 'Auto-hide\x20canvas\x20toolbar',
        'desc': 'When\x20enabled,\x20the\x20canvas\x20toolbar\x20tucks\x20into\x20its\x20current\x20screen\x20edge\x20and\x20expands\x20on\x20hover\x20or\x20focus'
      }),
      'bottomLeftBarAutoHide': Object["freeze"]({
        'label': 'Auto-hide\x20bottom-left\x20bar',
        'desc': "When enabled, the bottom-left controls and minimap tuck into the corner and expand on hover or focus"
      }),
      'canvasWheelBehavior': Object["freeze"]({
        'label': "Control style",
        'desc': "Trackpad mode: pan freely with two fingers and pinch to zoom; use Ctrl/⌘+wheel with a mouse to zoom",
        'zoom': "Wheel zoom",
        'pan': 'Trackpad\x20mode'
      }),
      'cursorSize': Object['freeze']({
        'label': "Cursor size",
        'desc': 'Choose\x20the\x20displayed\x20cursor\x20size',
        'small': "Small",
        'medium': "Medium",
        'large': "Large"
      }),
      'promptAttachmentButtonHidden': Object["freeze"]({
        'label': "Hide mouse connect button",
        'desc': 'Hides\x20the\x20add-reference\x20connect\x20entry\x20at\x20the\x20top-left\x20of\x20nodes\x20without\x20affecting\x20existing\x20links\x20or\x20@\x20references',
        'no': 'No',
        'yes': 'Yes'
      }),
      'promptPresetButtonHidden': Object["freeze"]({
        'label': "Hide prompt preset button",
        'desc': "Hides the book entry at the top-right of prompt fields; type / to open presets instead",
        'no': 'No',
        'yes': 'Yes'
      }),
      'inputFontSize': Object["freeze"]({
        'label': "Input font size",
        'desc': "Adjust the font size of node prompt inputs",
        'small': "Small",
        'medium': "Medium",
        'large': "Large"
      }),
      'promptEnterBehavior': Object["freeze"]({
        'label': "Prompt Enter behavior",
        'desc': 'When\x20Enter\x20inserts\x20a\x20new\x20line,\x20use\x20Ctrl/⌘+Enter\x20to\x20send',
        'submit': "Enter sends",
        'newline': 'Enter\x20inserts\x20line'
      }),
      'imageUploadQuality': Object["freeze"]({
        'label': "Image input upload quality",
        'desc': "Compression quality for reference images before generation",
        'standard': 'Standard',
        'highFidelity': "High fidelity",
        'originalFirst': 'Original\x20first'
      }),
      'videoAudioDefaultEnabled': Object['freeze']({
        'label': "Video audio",
        'desc': "Controls the audio playback state when video nodes are created or opened"
      }),
      'completionSound': Object['freeze']({
        'label': "Completion sound",
        'desc': "Play a sound after generation tasks succeed",
        'on': 'On',
        'off': "Off"
      }),
      'completionNotification': Object["freeze"]({
        'label': "Bottom-right notification",
        'desc': "Show a system notification after generation succeeds when the canvas window is inactive",
        'on': 'On',
        'off': 'Off'
      }),
      'completionVolume': Object["freeze"]({
        'label': "Sound volume",
        'desc': "Control the completion sound volume"
      }),
      'systemSound': Object["freeze"]({
        'label': "System sound",
        'desc': "Put .mp3 files in the system sound folder, then refresh and choose one",
        'selectAria': "Choose notification sound file",
        'openFolder': 'Open\x20system\x20sound\x20folder',
        'refresh': 'Refresh\x20sound\x20list',
        'preview': 'Preview\x20sound'
      })
    }),
    'canvasAlign': Object["freeze"]({
      'title': "Canvas & Alignment",
      'canvasDisplay': 'Canvas\x20Display',
      'dragSnapping': "Drag Snapping",
      'multiSelectAlign': "Multi-select Alignment",
      'gridDots': Object["freeze"]({
        'label': "Grid dots",
        'desc': "Only affects display; grid snapping is unchanged"
      }),
      'connectionLines': Object["freeze"]({
        'label': 'Connection\x20lines',
        'desc': "Controls connection line visibility only; node links are unchanged"
      }),
      'connectionLineStyle': Object["freeze"]({
        'label': "Connection line style",
        'desc': 'Choose\x20the\x20path\x20style\x20for\x20canvas\x20connections\x20and\x20drag\x20previews',
        'curve': "Curve",
        'orthogonal': "Right angle",
        'straight': "Straight"
      }),
      'relatedHighlight': Object["freeze"]({
        'label': 'Highlight\x20related\x20nodes\x20on\x20selection',
        'desc': "Highlight directly connected upstream and downstream nodes and lines"
      }),
      'highlightColor': Object["freeze"]({
        'label': "Highlight color",
        'desc': "Set the border and glow color for related nodes"
      }),
      'colors': Object['freeze']({
        'white': "White",
        'blue': "Blue",
        'green': "Green",
        'cyan': "Cyan",
        'purple': 'Purple',
        'red': 'Red',
        'yellow': 'Yellow'
      }),
      'snapGuides': Object["freeze"]({
        'label': "Guide snapping",
        'desc': "Show guide lines and snap automatically when dragging a single node"
      }),
      'snapGrid': Object["freeze"]({
        'label': 'Grid\x20snapping',
        'desc': "Snap dragged nodes to the grid when enabled"
      }),
      'alignTrigger': Object["freeze"]({
        'label': "Enable multi-select alignment",
        'desc': "Choose hold or click behavior for the center alignment panel shortcut",
        'hold': 'Hold\x20to\x20open',
        'click': "Click to open",
        'off': 'Off'
      }),
      'alignGap': Object["freeze"]({
        'label': "Alignment gap",
        'desc': 'Keep\x20the\x20first\x20node\x20fixed,\x20then\x20distribute\x20following\x20nodes\x20by\x20this\x20gap'
      })
    }),
    'nodeBehavior': Object["freeze"]({
      'title': "Node Creation & Behavior",
      'nodeDisplay': 'Node\x20Display',
      'nodeInteraction': "Node Interaction",
      'commentNote': "Comment Nodes",
      'newNode': 'New\x20Node\x20Creation',
      'selectionMediaProperties': Object["freeze"]({
        'label': "Selected node properties",
        'desc': "Show selected media details and character counts while editing prompts or text"
      }),
      'titleFollowsZoom': Object['freeze']({
        'label': "Titles follow canvas zoom",
        'desc': 'When\x20enabled,\x20regular\x20node\x20titles\x20scale\x20with\x20the\x20canvas;\x20when\x20disabled,\x20they\x20keep\x20their\x20screen\x20size'
      }),
      'mediaResize': Object['freeze']({
        'label': 'Image\x20and\x20video\x20node\x20resizing',
        'desc': "Allow resizing image/video nodes from the bottom-right corner without changing the reset-size shortcut"
      }),
      'promptBoxResize': Object["freeze"]({
        'label': 'Resizable\x20prompt\x20boxes',
        'desc': "Allow dragging the bottom edge of prompt boxes to adjust height"
      }),
      'commentJumpFocus': Object["freeze"]({
        'label': "Comment jump focus position",
        'desc': "When jumping to a comment node, place its center at this relative position in the canvas viewport",
        'x': "Horizontal",
        'y': "Vertical"
      }),
      'nodeSpacing': Object['freeze']({
        'label': "Node creation spacing",
        'desc': 'Horizontal\x20offset\x20used\x20when\x20generating\x20new\x20nodes'
      }),
      'nodeDirection': Object["freeze"]({
        'label': 'Continuous\x20node\x20direction',
        'desc': "Direction to search when nearby space is occupied",
        'right': "Right",
        'down': "Down"
      }),
      'nodeAvoidOverlap': Object["freeze"]({
        'label': "Avoid existing nodes",
        'desc': "Automatically avoid existing nodes when creating new nodes"
      })
    }),
    'fileSave': Object["freeze"]({
      'title': "Files & Save",
      'lead': "Configure local folders for projects, asset data, and generated outputs. Authorization, API keys, and user settings stay in the app data folder.",
      'rootDir': Object["freeze"]({
        'label': "Save root folder",
        'desc': "Projects, data, and outputs are saved together under this folder",
        'placeholder': "For example D:\\Canvas AI Files",
        'pickAria': "Choose save root folder",
        'choose': "Choose"
      }),
      'subtitleRecognition': Object["freeze"]({
        'engineLabel': "Subtitle recognition engine",
        'engineDesc': "Local subtitle recognition model used by Voice Studio",
        'cpu': "CPU",
        'gpu': 'GPU\x20acceleration',
        'saved': "Subtitle recognition settings saved",
        'saveFailed': "Failed to save subtitle recognition settings: {error}",
        'readyToast': 'Subtitle\x20recognition\x20and\x20speaker\x20separation\x20models\x20are\x20ready',
        'prepareFailed': "Failed to prepare subtitle recognition and speaker separation models: {error}",
        'runtimeCheckFailed': "Failed to check subtitle recognition runtime: {error}",
        'gpuInstallReadyToast': "GPU acceleration component installed",
        'gpuInstallFailed': "Failed to install GPU acceleration component: {error}",
        'gpuUnavailableToast': "GPU acceleration is unavailable. Switch to CPU or install the GPU acceleration component.",
        'status': Object["freeze"]({
          'download': "Download subtitle component / models",
          'downloading': "Downloading {percent}",
          'installing': "Installing {percent}",
          'checking': 'Checking',
          'ready': "Ready",
          'retry': "Retry",
          'gpuRequired': "Install GPU component"
        }),
        'runtime': Object["freeze"]({
          'noTaskId': "Model preparation task did not return a task ID",
          'checkingGpu': "Checking GPU acceleration...",
          'installingGpuTorch': "Installing CUDA-enabled torch...",
          'gpuUnavailable': "CUDA is unavailable in the current runtime. Switch to CPU or install the GPU acceleration component.",
          'torchCpuOnly': "The current runtime has CPU-only torch installed, so GPU acceleration cannot be used. Install CUDA-enabled torch.",
          'torchCpuOnlyWithGpu': "NVIDIA GPU detected ({gpu}), but the current runtime has CPU-only torch installed. Install CUDA-enabled torch.",
          'torchMissing': 'The\x20current\x20runtime\x20does\x20not\x20have\x20torch\x20installed.\x20Install\x20the\x20GPU\x20acceleration\x20component\x20or\x20switch\x20to\x20CPU.',
          'cudaUnavailable': 'CUDA-enabled\x20torch\x20is\x20installed,\x20but\x20CUDA\x20failed\x20to\x20initialize.\x20Check\x20the\x20GPU\x20driver\x20and\x20torch\x20CUDA\x20version.'
        })
      }),
      'migration': Object["freeze"]({
        'label': "Migrate save location",
        'preparing': "Preparing files for migration",
        'migrating': "Migrating files",
        'creatingTask': 'Creating\x20migration\x20task',
        'migrateOutput': "Migrating output save path",
        'done': "Migration complete",
        'processed': "Processed",
        'copied': "Copied",
        'skipped': "Skipped",
        'failed': 'Failed',
        'current': "Current: {file}",
        'itemFailed': "Migration failed",
        'noJobId': "Migration task did not return a jobId",
        'failedMessage': "File migration failed",
        'summary': "Migration complete: copied {copied}, skipped {skipped}, failed {failed}"
      }),
      'validation': Object["freeze"]({
        'chooseRoot': "Choose a save root folder",
        'projectPath': "Enter a project save path",
        'dataPath': 'Enter\x20a\x20data\x20file\x20save\x20path',
        'outputPath': "Enter an output file save path"
      }),
      'runtime': Object["freeze"]({
        'saving': "Migrating...",
        'choose': 'Choose',
        'choosing': "Choosing...",
        'pickerUnsupported': "Directory selection is not supported in this environment",
        'pickTitle': 'Choose\x20save\x20root\x20folder',
        'pickFailed': "Failed to choose folder: {error}",
        'loadFailed': "Failed to load file and save paths",
        'partialMigrationFailed': "Save location was updated, but some files failed to migrate. {summary}",
        'saveFailed': "Failed to save file paths: {error}",
        'unknownError': 'Unknown\x20error'
      }),
      'localCleanup': Object["freeze"]({
        'label': "Clean unused files",
        'desc': 'Scan\x20current\x20asset\x20folders\x20for\x20files\x20with\x20no\x20reference\x20in\x20the\x20checked\x20projects,\x20then\x20select\x20which\x20files\x20to\x20move\x20to\x20the\x20Recycle\x20Bin',
        'scan': "Scan unused files",
        'trash': "Move selected to Recycle Bin",
        'count': 'Files\x20to\x20review',
        'size': 'Total\x20candidate\x20size',
        'idle': "Scan, then select files to clean up. Nothing is selected by default.",
        'scanning': "Scanning local asset references...",
        'scanBusy': "Scanning...",
        'trashing': "Moving files to the system Recycle Bin...",
        'trashBusy': "Processing..."
      }),
      'cleanupRuntime': Object['freeze']({
        'notSupported': "Local asset cleanup is not supported in this environment",
        'scanIncomplete': "Scan incomplete. Cleanup is disabled. Resolve the read issues below and scan again.",
        'snapshotUnavailable': "Unable to read the current canvas snapshot. Cleanup stopped; please retry.",
        'scanEmptySummary': "Scanned {candidateCount} local files and found no files to review",
        'scanFoundSummary': 'Scanned\x20{candidateCount}\x20local\x20files,\x20found\x20{orphanCount}\x20files\x20to\x20review,\x20totaling\x20{orphanBytes}',
        'selectPage': 'Select\x20this\x20page',
        'clearSelection': "Clear selection",
        'previousPage': 'Previous',
        'nextPage': "Next",
        'pageSummary': "Page {page} / {pages}",
        'selectedSummary': "Selected {count}, totaling {bytes}",
        'selectFile': 'Select\x20{path}',
        'kinds': Object['freeze']({
          'image': 'Image',
          'video': "Video",
          'audio': "Audio",
          'waveform': "Waveform",
          'media': 'Media'
        }),
        'scopeNotice': "Checked current canvases, projects in the save folder, recent projects, recovery snapshots, the asset library and workflows. Unregistered projects elsewhere are outside this scan. No known reference does not mean a file is no longer needed; review before selecting.",
        'scopeProjects': "Project files: {count}; project save folder: {path}",
        'refreshFailed': "{message}; list refresh failed: {error}. Please scan again.",
        'scanFailed': "Scan failed",
        'scanFailedDetail': "Scan failed: {error}",
        'confirmTrash': 'Move\x20the\x20{count}\x20selected\x20files\x20to\x20the\x20system\x20Recycle\x20Bin?\x0aTotal:\x20{bytes}.\x20Unselected\x20files\x20will\x20be\x20kept.\x20References\x20will\x20be\x20checked\x20again\x20before\x20cleanup.',
        'trashedMessage': "Moved {count} files to the Recycle Bin, {bytes}",
        'trashPartial': "{message}; skipped {skipped}, failed {failed}",
        'trashPartialToast': "Some files could not be moved to the Recycle Bin",
        'trashFailed': "Cleanup failed",
        'trashFailedDetail': "Cleanup failed: {error}"
      }),
      'diagnostics': Object['freeze']({
        'label': "Error logs & diagnostics",
        'desc': "Create a diagnostics package that can be sent to developers for troubleshooting. It does not include project files, assets, or API keys.",
        'create': "Create diagnostics package",
        'openLogs': "Open logs folder",
        'creating': "Creating...",
        'collecting': 'Collecting\x20logs\x20and\x20creating\x20diagnostics\x20package...',
        'created': "Diagnostics package created",
        'createdWithFile': "Diagnostics package created: {filename}",
        'createFailed': "Failed to create diagnostics package",
        'openLogsFailed': 'Failed\x20to\x20open\x20logs\x20folder'
      }),
      'save': "Save"
    }),
    'objectStorage': Object['freeze']({
      'title': 'Object\x20Storage',
      'lead': 'Choose\x20your\x20object\x20storage\x20provider.\x20Provider-specific\x20connection\x20details\x20are\x20handled\x20automatically.',
      'enabled': Object["freeze"]({
        'label': 'Use\x20custom\x20object\x20storage'
      }),
      'providerPicker': Object["freeze"]({
        'aria': 'Object\x20storage\x20provider'
      }),
      'providers': Object["freeze"]({
        'cloudflareR2': Object["freeze"]({
          'title': "Cloudflare R2",
          'badge': 'R2',
          'desc': "Enter the R2 S3 API endpoint, bucket, and public access domain.",
          'console': "Open R2 console",
          'accessKeyIdLabel': "Access Key ID",
          'secretAccessKeyLabel': 'Secret\x20Access\x20Key'
        }),
        'tencentCos': Object["freeze"]({
          'title': "Tencent Cloud COS",
          'badge': 'COS',
          'desc': "Enter the full Bucket name including APPID. A configured custom or CDN domain is recommended.",
          'console': 'Open\x20COS\x20console',
          'accessKeyIdLabel': "SecretId",
          'secretAccessKeyLabel': "SecretKey"
        }),
        'aliyunOss': Object["freeze"]({
          'title': 'Alibaba\x20Cloud\x20OSS',
          'badge': "OSS",
          'desc': "Enter the Bucket region. The matching S3 endpoint is generated automatically.",
          'console': "Open OSS console",
          'accessKeyIdLabel': 'AccessKey\x20ID',
          'secretAccessKeyLabel': "AccessKey Secret"
        }),
        's3Compatible': Object["freeze"]({
          'title': "Other S3 storage",
          'badge': 'S3',
          'desc': "For other S3-compatible services. Region and Bucket address style can be configured manually.",
          'accessKeyIdLabel': 'Access\x20Key\x20ID',
          'secretAccessKeyLabel': "Secret Access Key"
        })
      }),
      's3': Object['freeze']({
        'title': "S3-compatible storage"
      }),
      'fields': Object["freeze"]({
        'endpoint': "S3 API (Endpoint)",
        'region': "Region",
        'bucket': 'Bucket',
        'accessKeyId': "Access Key ID",
        'secretAccessKey': "Secret Access Key",
        'publicBaseUrl': "Public base URL",
        'publicBaseUrlDesc': "Files must open directly at this address. For private buckets, allow reads for the Canvas-AI prefix or use a configured CDN domain.",
        'addressingStyle': "Bucket address style"
      }),
      'placeholders': Object["freeze"]({
        'endpoint': 'https://<account-id>.r2.cloudflarestorage.com',
        'region': 'ap-guangzhou',
        'bucket': "aicanvas-assets",
        'accessKeyId': 'Access\x20Key\x20ID',
        'secretAccessKey': "Secret Access Key",
        'publicBaseUrl': "https://assets.example.com"
      }),
      'addressing': Object["freeze"]({
        'path': "Bucket in path",
        'virtualHosted': 'Bucket\x20in\x20domain'
      }),
      'actions': Object["freeze"]({
        'tutorial': "Tutorial",
        'register': "Register for Cloudflare R2",
        'test': 'Test\x20connection',
        'testing': "Testing...",
        'saving': "Saving..."
      }),
      'status': Object["freeze"]({
        'disabled': 'Not\x20enabled.',
        'enabled': "Enabled. Field changes are saved automatically.",
        'testing': "Uploading and reading back a temporary test image...",
        'testSuccess': "Connection test passed. Upload and public read access both work.",
        'ready': "Ready",
        'testCleanupWarning': "The temporary test file could not be deleted. Check delete permission or lifecycle rules.",
        'testFailed': "Connection test failed: {error}",
        'testRequired': "Pass the connection test before enabling object storage.",
        'changedRequiresRetest': "Object storage settings were saved. Verification is no longer valid, so storage was disabled. Test the connection again.",
        'savedEnabled': 'Object\x20storage\x20is\x20enabled.\x20Future\x20public\x20relay\x20images\x20will\x20use\x20it\x20automatically.',
        'savedDisabled': "Object storage is disabled. The current upload path is restored.",
        'saveSuccess': "Object storage settings saved",
        'saveFailed': 'Failed\x20to\x20save\x20object\x20storage\x20settings:\x20{error}',
        'providerSelected': "Switched to {provider}.",
        'providerSelectedDisabled': "Switched to {provider}. Complete the fields and test the connection before enabling it.",
        'unknownError': 'Unknown\x20error'
      })
    }),
    'cliLogin': Object["freeze"]({
      'title': "CLI Login",
      'lead': "Manage service accounts authorized through local CLI components.",
      'localAccount': "Local account",
      'statusLabel': "Login status",
      'checking': "Checking...",
      'login': 'Log\x20in',
      'logout': "Log out",
      'providers': Object["freeze"]({
        'codex': Object["freeze"]({
          'title': "OpenAI CLI",
          'description': 'When\x20signed\x20out,\x20click\x20Log\x20in\x20and\x20complete\x20the\x20official\x20ChatGPT\x20sign-in\x20in\x20the\x20browser\x20as\x20prompted.\x20Do\x20not\x20choose\x20API\x20Key\x20or\x20Access\x20Token.'
        })
      })
    }),
    'apiInput': Object["freeze"]({
      'title': "Model Services",
      'lead': "Connect only the model service you plan to use. Models cannot submit generation requests until their service is configured.",
      'apiKey': "API key",
      'apiToken': 'API\x20token',
      'endpoint': 'Endpoint',
      'testConnection': "Test connection",
      'getKey': "Get Key",
      'save': "Save",
      'catalog': Object["freeze"]({
        'categoryAria': "Filter model services by node type",
        'categoryAll': "All",
        'categoryText': "Text",
        'categoryImage': 'Image',
        'categoryVideo': "Video",
        'categoryAudio': 'Audio',
        'providerAria': 'Model\x20service\x20providers',
        'routeLabel': "Service route",
        'routeAria': "Choose a service route",
        'routeDomestic': "Mainland China",
        'routeInternational': "International",
        'allRoutesReady': "All verified",
        'routesReady': "{count}/{total} verified"
      }),
      'readiness': Object["freeze"]({
        'title': 'Connect\x20a\x20model\x20service\x20first',
        'checking': "Checking saved model service settings...",
        'checkingShort': 'Checking',
        'requiredShort': "Setup needed",
        'empty': "No model service is connected. Choose a provider below, enter an API key, and save it to enable generation.",
        'emptyShort': "Not configured",
        'ready': "{count} model services are connected. Their models are ready to use.",
        'readyShort': "{count} configured"
      }),
      'route': Object["freeze"]({
        'label': "Route",
        'apimartAria': "APIMart route",
        'grsaiAria': "GRSAI route",
        'domestic': 'China\x20route',
        'global': "Global route",
        'domestic1': "China route 1",
        'domestic2': "China route 2",
        'overseas': 'Overseas\x20route',
        'custom': 'Custom\x20route:\x20{value}'
      }),
      'customProvider': Object['freeze']({
        'title': 'Custom\x20provider\x20models',
        'lead': "Discover /v1/models first, then choose models for node menus. Unverified models send required fields only.",
        'addProvider': "New provider",
        'editorTitle': "Configure provider",
        'editorNote': "Enter the endpoint and key, then discover models. Unverified capabilities use a minimal compatibility profile.",
        'refreshBundles': "Refresh",
        'refreshBundlesTitle': "Refresh custom manifests",
        'baseUrl': "Base URL",
        'baseUrlPlaceholder': "https://xxx.com",
        'apiKey': "API Key",
        'apiKeyPlaceholder': 'sk-...',
        'documentationUrl': "API documentation URL / local file (optional)",
        'documentationUrlPlaceholder': "Optional; leave blank to discover docs from the Base URL",
        'documentationAgentHint': "When left blank, documentation is discovered from the Base URL homepage and common OpenAPI or Swagger paths. If discovery fails, enter an Apifox or other documentation URL, or choose a local Markdown, text, JSON, or YAML document.",
        'selectDocumentationFile': "Choose document",
        'localDocumentationSelected': "Local document: {name}",
        'localDocumentationTooLarge': "Local API documentation must not exceed 2 MB.",
        'localDocumentationUnsupported': 'Choose\x20a\x20Markdown,\x20TXT,\x20JSON,\x20YAML,\x20or\x20HTML\x20document.',
        'localDocumentationReadFailed': 'Failed\x20to\x20read\x20local\x20API\x20documentation:\x20{error}',
        'tutorial': "Beginner tutorial",
        'discover': 'Discover\x20models',
        'addModels': "Add models",
        'saveModels': 'Save\x20models',
        'verifyParameters': "Recognize documented parameters",
        'verifyingParameters': "Recognizing documented parameters...",
        'sourceLiveCapabilities': "Live capabilities",
        'sourceIncomplete': "Some sources could not be read; access to models found in documentation remains unconfirmed.",
        'sourceDocumentation': "From docs · access unconfirmed",
        'documentationUrlRequired': "Enter an API documentation URL or choose a local document first.",
        'documentationAutoDiscoveryFailed': "No API documentation was found from the Base URL. Enter a documentation URL or choose a local document.",
        'parametersVerified': 'Documented\x20parameters\x20recognized\x20for\x20{documented}\x20model(s).\x20No\x20real\x20model\x20request\x20was\x20sent.',
        'parametersVerifiedPartial': "Documented parameters recognized for {documented}/{count} model(s); the rest still use the minimal profile. No real model request was sent.",
        'parametersVerifiedAfterRepair': 'Documented\x20parameters\x20recognized\x20after\x20automatic\x20correction\x20for\x20{documented}\x20model(s).\x20No\x20real\x20model\x20request\x20was\x20sent.',
        'parametersVerifiedPartialAfterRepair': "Documented parameters recognized after automatic correction for {documented}/{count} model(s); the rest still use the minimal profile. No real model request was sent.",
        'parameterVerificationFailed': 'Documented\x20parameter\x20recognition\x20failed:\x20{error}',
        'providerDraftInitial': "Provider 1",
        'providerDraftTitle': 'Provider\x20{index}',
        'deleteProviderDraft': "Delete provider",
        'providerDisplayName': "Provider display name",
        'providerDisplayNamePlaceholder': "Defaults to the site name",
        'selectModels': "Choose models to add",
        'selectionHint': "Selected models appear in matching node menus. Unverified models do not send guessed ratio, resolution, count, or quality fields.",
        'capabilityUnverified': "Params unverified",
        'capabilityUnverifiedHint': "Only required model and prompt fields are enabled to avoid failures from guessed parameters.",
        'capabilityDocumented': "Docs recognized",
        'capabilityDocumentedHint': "Parameters came from API documentation and passed manifest validation, but no real billable request has verified them yet.",
        'modelKindLabel': "Model category:",
        'classifyBeforeSelecting': 'Choose\x20a\x20model\x20category\x20above\x20first',
        'vipRequired': "Custom providers are a VIP feature. Activate access first.",
        'discovering': "Discovering...",
        'analyzingDocumentation': 'Analyzing\x20API\x20documentation...',
        'validating': "Validating",
        'saved': "Saved {count} models",
        'savedWithUnverified': "Saved {count} models ({unverified} have unverified parameters and use the minimal profile)",
        'savedDocumented': "Saved {count} models; {documented} received documented parameters",
        'documentationAgentUnavailable': 'The\x20documentation\x20is\x20not\x20OpenAPI\x20and\x20no\x20canvas\x20Agent\x20text\x20model\x20is\x20configured.\x20Models\x20were\x20saved\x20with\x20minimal\x20parameters.',
        'documentationNoMatchingProfile': "No documented operation matched the selected model kinds. Those models were saved with minimal parameters.",
        'documentationAgentInaccessible': 'The\x20Agent\x20could\x20not\x20open\x20or\x20continue\x20browsing\x20the\x20API\x20documentation.\x20Confirm\x20that\x20the\x20selected\x20Agent\x20model\x20supports\x20web\x20access\x20and\x20that\x20the\x20docs\x20do\x20not\x20require\x20sign-in.',
        'documentationSelectedModelNotFound': 'The\x20Agent\x20searched\x20specifically\x20for\x20the\x20selected\x20model,\x20but\x20the\x20documentation\x20did\x20not\x20contain\x20its\x20API\x20operation.',
        'documentationAsyncLifecycleUnsupported': "The model API was found, but the docs are missing complete polling details: task id, status endpoint, or result path. It will be saved with the minimal profile for now.",
        'documentationAnalysisFailed': "API documentation analysis failed: {error}. Models were saved with minimal parameters.",
        'savedBundles': "Added models",
        'notLoaded': "Not loaded",
        'noBundles': "No custom manifests saved yet",
        'loadingBundles': "Loading custom manifests...",
        'resultSummary': 'Discovered\x20{count}\x20models,\x20{supported}\x20selectable,\x20{unknown}\x20unknown',
        'unsupportedSummary': "{count} models are not supported for registration yet",
        'bundleMeta': "{modelCount} models · {kindList}",
        'bundleTitle': "{providerName} -> {models}",
        'bundleExpand': 'Expand',
        'bundleCollapse': "Collapse",
        'deleteBundle': "Delete",
        'deleteBundleTitle': "Delete custom manifest",
        'deleteSuccess': 'Custom\x20manifest\x20deleted',
        'fillRequired': 'Enter\x20Base\x20URL\x20and\x20API\x20Key',
        'apiUnsupported': 'Custom\x20provider\x20endpoints\x20are\x20not\x20connected\x20in\x20this\x20build',
        'noModelsDiscovered': "No selectable models were discovered",
        'noModelsInFilter': 'No\x20selectable\x20models\x20in\x20this\x20category',
        'noModelsSelected': "Select at least one model first",
        'configSavedNoSupportedModels': 'Custom\x20provider\x20configuration\x20was\x20saved.\x20Assign\x20categories\x20under\x20Unknown\x20before\x20adding\x20models.',
        'duplicateProviderDomain': "A provider with the same domain already exists. Do not add the same domain twice.",
        'noSupportedModels': "No registrable text / image / video / audio models found",
        'loadBundlesFailed': "Failed to load custom manifests: {error}",
        'saveFailed': 'Failed\x20to\x20save\x20custom\x20provider:\x20{error}',
        'deleteFailed': "Failed to delete custom manifest: {error}",
        'kindAll': "All",
        'kindText': "Text",
        'kindImage': "Image",
        'kindVideo': "Video",
        'kindAudio': "Audio",
        'kindEmbedding': "Embedding",
        'kindUnknown': "Unknown",
        'modelsMore': "{count} more",
        'manualModelHint': 'Not seeing your models? Add one manually by entering its upstream name.',
        'manualModelIdPlaceholder': "Enter model name, e.g. gpt-4o, SDXL",
        'addManualModel': 'Add manually',
        'manualModelDuplicate': "Model “{id}” is already in the list",
        'manualModelAdded': "Manually added model “{id}”",
        'quickAddLabel': 'Add custom model',
        'quickAddIdPlaceholder': "Enter upstream model name, e.g. flux-pro",
        'quickAddConfirm': 'Add & use',
        'quickAddNoRelay': 'Add and configure a custom relay in Settings first',
        'quickAddSelectRelay': 'Select relay',
        'quickAddMissingId': 'Please enter a model name',
        'quickAddBusy': 'Adding model…',
        'quickAdded': "Added custom model “{id}”, select it to use",
        'quickAddFailed': "Failed to add custom model: {error}"
      }),
      'diagnostics': Object["freeze"]({
        'skipped': "Skipped",
        'passed': 'Passed',
        'failed': "Failed",
        'partialPassed': "Partially passed",
        'notPassed': 'Not\x20passed',
        'step': "Step",
        'testUnsupported': "Connection testing is not supported in this version",
        'fillProviderKey': "Enter this provider's API key first",
        'fillProviderUrl': 'Enter\x20this\x20provider\x27s\x20endpoint\x20first',
        'fillOneProviderKey': "Enter at least one provider API key first",
        'testing': 'Testing',
        'testingBusy': 'Testing...',
        'testFailed': 'Connection\x20test\x20failed',
        'testPassed': 'Connection\x20test\x20passed',
        'testNotPassed': "Connection test did not pass",
        'providerPassed': '{label}\x20connection\x20test\x20passed',
        'allPassed': "API connection test passed",
        'providerFailed': 'Connection\x20test\x20did\x20not\x20pass:\x20{label}\x20-\x20{error}',
        'testFailedWithDetail': "Connection test failed: {error}",
        'unknownError': "Unknown error",
        'loadFailed': "Failed to load API config: {error}",
        'saveSuccess': "API config saved",
        'saveFailed': "Save failed: {error}"
      }),
      'statuses': Object['freeze']({
        'unconfigured': "Not configured",
        'configured': "Filled, not verified",
        'configuredCount': "{count}/{total} configured",
        'deprecated': "Deprecated soon",
        'unavailable': 'Unavailable',
        'frontendPlaceholder': "Frontend placeholder",
        'oauthLogin': "OAuth login"
      }),
      'providers': Object["freeze"]({
        'bailian': Object["freeze"]({
          'title': "Alibaba Cloud Model Studio",
          'testTitle': 'Test\x20Alibaba\x20Cloud\x20Model\x20Studio\x20connection',
          'getTitle': "Get an Alibaba Cloud Model Studio API Key"
        }),
        'deepseek': Object["freeze"]({
          'title': "DeepSeek",
          'testTitle': "Test DeepSeek connection",
          'getTitle': "Get a DeepSeek API Key"
        }),
        'binghuo': Object['freeze']({
          'title': "Cheap Channel BH",
          'testTitle': "Test Cheap Channel BH connection",
          'getTitle': "Go to Cheap Channel BH to get an API token",
          'guideButtonTitle': 'View\x20the\x20Cheap\x20Channel\x20BH\x20guide',
          'guideButton': 'Beginner\x20tutorial'
        }),
        'apimart': Object["freeze"]({
          'testTitle': "Test APIMart connection",
          'getTitle': "Go to APIMart to get an API key",
          'guideButtonTitle': "Open the APIMart API key guide",
          'guideButton': "Beginner tutorial",
          'close': "Close",
          'guideTitle': "How to get an APIMart API key",
          'guideSubtitle': "After signing in to APIMart, open the top-right avatar menu, choose API 密钥, then create or copy an API key.",
          'guideAlt': "Long guide image for getting an APIMart API key",
          'guideChecklistTitle': "Setup steps",
          'guideNote1': "The Get Key button opens APIMart. Sign in if you already have an account, or register first.",
          'guideNote2': "After signing in, click the top-right avatar, such as G, and choose API 密钥 from the menu.",
          'guideNote3': "On the API 密钥 page, click + 创建 API 密钥 on the top right. You can also copy an existing key row.",
          'guideNote4': "Copy the sk- API key and paste it into Canvas AI APIMart. Keep Domestic route 1 unless testing fails.",
          'openConsole': "Open APIMart",
          'openSettings': "Open settings"
        }),
        'minimax': Object["freeze"]({
          'domesticName': "MiniMAX Official (Mainland China)",
          'internationalName': "MiniMAX Official (International)",
          'domesticTestTitle': "Test MiniMAX Mainland China connection",
          'internationalTestTitle': "Test MiniMAX international connection",
          'domesticGetTitle': "Go to MiniMAX Mainland China for an API key",
          'internationalGetTitle': "Go to MiniMAX International for an API key"
        }),
        'agnes': Object['freeze']({
          'domesticName': "Agnes AI (Mainland China)",
          'internationalName': 'Agnes\x20AI\x20(International)',
          'domesticTestTitle': 'Test\x20Agnes\x20AI\x20Mainland\x20China\x20connection',
          'internationalTestTitle': "Test Agnes AI international connection",
          'testTitle': 'Test\x20Agnes\x20AI\x20connection',
          'getTitle': 'Go\x20to\x20Agnes\x20AI\x20to\x20get\x20an\x20API\x20key',
          'guideButtonTitle': 'Open\x20the\x20Agnes\x20AI\x20API\x20key\x20guide',
          'guideButton': "Beginner tutorial",
          'close': "Close",
          'guideTitle': "How to get an Agnes AI API key",
          'guideSubtitle': 'Open\x20the\x20Agnes\x20platform\x20API\x20key\x20page,\x20use\x20Settings\x20>\x20API\x20密钥\x20in\x20the\x20left\x20sidebar,\x20then\x20click\x20创建新的密钥\x20and\x20copy\x20the\x20personal\x20key.',
          'guideAlt': "Long guide image for getting an Agnes AI API key",
          'guideChecklistTitle': "Setup steps",
          'guideNote1': 'Click\x20Get\x20Key\x20to\x20open\x20the\x20Agnes\x20platform.\x20Sign\x20in\x20first\x20if\x20needed,\x20then\x20open\x20the\x20API\x20密钥\x20page\x20under\x20Settings.',
          'guideNote2': "In the left sidebar, under 设置, click API 密钥. The main page title should also be API 密钥.",
          'guideNote3': "Click 创建新的密钥 and copy the sk- personal key from the table. 企业密钥 is for enterprise accounts.",
          'guideNote4': "Return to Canvas AI Settings > API Key > Agnes AI, paste the key, and test the connection.",
          'openConsole': 'Open\x20Agnes\x20keys',
          'openSettings': 'Open\x20settings'
        }),
        'volcengine': Object["freeze"]({
          'title': "Volcengine Ark",
          'testTitle': "Test Volcengine Ark connection",
          'getTitle': 'Go\x20to\x20Volcengine\x20Ark\x20to\x20get\x20an\x20API\x20key',
          'guideButtonTitle': "Open the Volcengine Ark API key guide",
          'guideButton': 'Beginner\x20tutorial',
          'close': 'Close',
          'guideTitle': "How to get a Volcengine Ark API key",
          'guideSubtitle': "Enable the required models in Volcengine Ark 开通管理 first, then open API Key 管理 to create or copy a key.",
          'guideAlt': 'Long\x20guide\x20image\x20for\x20getting\x20a\x20Volcengine\x20Ark\x20API\x20key',
          'guideChecklistTitle': "Setup steps",
          'guideNote1': "In the Volcengine Ark console, click 开通管理 in the left sidebar. Sign in first if redirected.",
          'guideNote2': "Find the model Canvas AI will use and click 开通服务 on the right. You can also use 一键开通所有模型 at the top right.",
          'guideNote3': "After enabling the service, open API Key 管理, then create an API key or copy an existing usable key.",
          'guideNote4': 'Return\x20to\x20Canvas\x20AI\x20Settings\x20>\x20API\x20Key\x20>\x20Volcengine\x20Ark,\x20paste\x20the\x20key,\x20and\x20test\x20the\x20connection.',
          'openConsole': "Open Ark service activation",
          'openSettings': "Open settings"
        }),
        'volcengineSpeech': Object['freeze']({
          'title': "Volcengine Speech",
          'testTitle': "View Volcengine Speech service status",
          'getTitle': "Go to Volcengine Speech API Key Management",
          'guideButtonTitle': "Open the Volcengine Speech setup and API key guide",
          'guideButton': "Beginner tutorial",
          'apiKeyPlaceholder': "Speech X-Api-Key, not an Ark key..."
        }),
        'runninghub': Object["freeze"]({
          'domesticName': 'RunningHUB\x20(Mainland\x20China)',
          'internationalName': 'RunningHUB\x20(International)',
          'testTitle': "Test RunningHUB connection",
          'getTitle': 'Go\x20to\x20RunningHUB\x20to\x20get\x20an\x20API\x20key',
          'guideButtonTitle': "Open the RunningHUB API key guide",
          'guideButton': 'Beginner\x20tutorial',
          'setDefaultSite': "Set as default site",
          'workflowApiKey': "Workflow API key (consumer membership)",
          'workflowApiKeyHint': "Calls workflows / AI apps and consumes account credits (RH coins).",
          'modelApiKey': "Model API key (enterprise shared)",
          'modelApiKeyHint': 'Calls\x20model\x20APIs\x20and\x20consumes\x20wallet\x20balance.',
          'modelApiKeyPlaceholder': "Model API key...",
          'close': "Close",
          'guideTitle': "How to get RunningHUB API keys",
          'guideSubtitle': "Start from the RunningHUB website, click API in the top navigation, then click Keys. The consumer-membership key calls workflows and consumes credits; the enterprise-shared key calls model APIs and consumes wallet balance.",
          'guideAlt': "Long guide image for getting RunningHUB API keys",
          'guideChecklistTitle': "Setup steps",
          'guideNote1': "Open the RunningHUB website, click API in the top navigation, then click Keys on the API page.",
          'guideNote2': "Copy the key on Consumer Membership and paste it into Workflow API key for workflows / AI apps.",
          'guideNote3': "Switch to Enterprise Shared, copy that API key, and paste it into Model API key for model APIs.",
          'guideNote4': "If the page asks you to sign in, sign in to RunningHub first. Do not share your keys.",
          'openConsole': "Open RunningHUB website",
          'openSettings': 'Open\x20settings'
        }),
        'comfyui': Object["freeze"]({
          'title': "ComfyUI",
          'testTitle': "Test ComfyUI connection",
          'localTitle': "ComfyUI Local",
          'cloudTitle': "ComfyUI Cloud",
          'localTestTitle': "Test local ComfyUI connection",
          'cloudTestTitle': "Test cloud ComfyUI connection",
          'endpoint': "ComfyUI address",
          'localEndpoint': "ComfyUI local address",
          'cloudEndpoint': "ComfyUI cloud address",
          'placeholder': "127.0.0.1:8188",
          'cloudPlaceholder': "Paste the cloud ComfyUI address here",
          'localHint': "Uses 127.0.0.1:8188 by default.",
          'cloudHint': "Use this for a running cloud ComfyUI instance.",
          'hint': 'The\x20local\x20address\x20defaults\x20to\x20127.0.0.1:8188.\x20Use\x20the\x20cloud\x20address\x20for\x20an\x20already-started\x20cloud\x20ComfyUI\x20instance.'
        }),
        'grsai': Object["freeze"]({
          'testTitle': "Test GRSAI connection",
          'getTitle': "Go to GRSAI to get an API key",
          'guideButtonTitle': 'Open\x20the\x20GRSAI\x20API\x20key\x20guide',
          'guideButton': 'Beginner\x20tutorial',
          'close': 'Close',
          'guideTitle': "How to get a GRSAI API key",
          'guideSubtitle': "Open the GRSAI backend, then use the left sidebar: API Management > API Key. Create or copy a key on that page.",
          'guideAlt': "Long guide image for getting a GRSAI API key",
          'guideChecklistTitle': 'Setup\x20steps',
          'guideNote1': "Click Get Key to open the GRSAI API Key page. If it says 请先登录, click 立即登录.",
          'guideNote2': "After sign-in, find the API Management group in the left sidebar and click API Key.",
          'guideNote3': 'On\x20the\x20API\x20Key\x20/\x20管理您的API\x20Key\x20page,\x20click\x20创建API\x20Key\x20or\x20copy\x20an\x20existing\x20key.\x20Do\x20not\x20copy\x20balances\x20or\x20plan\x20text.',
          'guideNote4': "Return to Canvas AI Settings > API Key > GRSAI, paste the key, and test the connection.",
          'openConsole': 'Open\x20GRSAI\x20API\x20Key',
          'openSettings': "Open settings"
        }),
        'ppio': Object["freeze"]({
          'title': "PPIO",
          'testTitle': "Test PPIO connection",
          'getTitle': "Go to PPIO to get an API key"
        }),
        'openai': Object["freeze"]({
          'title': "OpenAI-Compatible API Format",
          'testTitle': "Test OpenAI-compatible connection",
          'formatHintAria': "OpenAI format help",
          'hintPrefix': "The correct generic OpenAI endpoint format comes after",
          'hintSuffix': 'for\x20example:'
        }),
        'dreamina': Object["freeze"]({
          'title': "Dreamina (Currently advanced members only)",
          'badge': 'D',
          'logoAlt': "Dreamina",
          'noticeAria': "Dreamina usage notes",
          'noticeTitle': "Before using",
          'noticeEntitlement': "Generation tasks consume account entitlements or credits and are currently available only to advanced members and above.",
          'noticeCreditPolicy': 'Credits\x20consumed\x20by\x20Dreamina\x20CLI\x20generation\x20follow\x20the\x20same\x20credit\x20standards\x20as\x20equivalent\x20capabilities\x20in\x20Dreamina\x20web\x20Agent\x20mode.\x20Final\x20rules\x20and\x20credit\x20records\x20in\x20the\x20product\x20apply.',
          'loginStatus': "Login status",
          'checking': "Checking...",
          'readingStatus': "Reading Dreamina status...",
          'accountCredit': "Account credits",
          'creditPlaceholder': 'Balance\x20appears\x20after\x20login',
          'login': "Log in",
          'logout': "Log out",
          'desc': "Use the official Dreamina OAuth authorization page. After confirming login on the page, the app will sync login status automatically.",
          'modalAria': "Dreamina login",
          'closeAria': "Close Dreamina login window",
          'accountBadge': "Dreamina account",
          'starting': 'Starting\x20Dreamina\x20login...',
          'qrAlt': "Dreamina login QR code",
          'waitText': 'After\x20completing\x20login\x20on\x20the\x20authorization\x20page,\x20the\x20app\x20will\x20sync\x20status\x20automatically.',
          'retry': "Restart login",
          'guideTitle': "OAuth Web Authorization",
          'stepAuth': "Open the authorization page and confirm login",
          'authUrlAria': "Dreamina authorization link",
          'open': 'Open\x20Authorization\x20Page',
          'copy': "Copy",
          'viewLogin': "View login",
          'relogin': "Log in again",
          'waitingAuthUrl': 'Waiting\x20for\x20authorization\x20link...',
          'missingValue': "{label} was not detected. Try again shortly.",
          'browserOpenFailedCopied': "The browser could not open directly. {label} was copied.",
          'browserOpenFailedCopyFirst': "The browser could not open directly. Copy {label} first.",
          'copySuccess': "{label} copied",
          'copyFailed': "Failed to copy {label}. Select the text manually to copy.",
          'authLinkLabel': "Dreamina authorization link",
          'jsonParseFailed': "Failed to parse JSON",
          'jsonPasteRequired': 'Paste\x20the\x20full\x20JSON\x20returned\x20by\x20the\x20final\x20redirect\x20page\x20in\x20step\x202\x20first',
          'jsonMustBeObject': 'JSON\x20must\x20be\x20an\x20object',
          'jsonFormatInvalid': "Invalid JSON format. Paste the full JSON returned by the final redirect page in step 2.",
          'jsonImportUnsupported': "This version does not support JSON import. Upgrade and try again.",
          'importFailed': "Failed to import login state",
          'importedSyncing': "Login state imported. Syncing status.",
          'qrLoadFailed': "QR image failed to load",
          'creditTotal': "Total credits {total} (membership {vip} / gift {gift} / purchase {purchase})",
          'loginSuccess': 'Dreamina\x20login\x20succeeded',
          'loginReused': "Current Dreamina login is still valid",
          'loginFailed': "Dreamina login failed",
          'statusPreparing': "Preparing",
          'statusWaitingAuth': "Waiting for authorization",
          'statusLoggingIn': "Logging in",
          'statusLoggedIn': 'Logged\x20in',
          'statusLoggedOut': 'Not\x20logged\x20in',
          'waitBrowserFailed': "The browser could not open automatically. Click Open Authorization Page to continue.",
          'waitOpenAuth': "Click Open Authorization Page and confirm login. The app will sync login status automatically.",
          'waitPendingTooLong': 'Login\x20is\x20taking\x20longer\x20than\x20expected.\x20Confirm\x20that\x20login\x20was\x20completed\x20on\x20the\x20authorization\x20page.',
          'waitQrDeprecated': "QR login is no longer the main flow. Use the OAuth authorization page below.",
          'waitFailed': "Login failed. Reopen the authorization page and confirm login.",
          'waitConfirm': 'Complete\x20Dreamina\x20login\x20confirmation\x20on\x20the\x20authorization\x20page.',
          'waitUseOAuth': 'Use\x20the\x20OAuth\x20authorization\x20page\x20to\x20complete\x20login.',
          'waitDone': "Login complete. Updating account information...",
          'waitOAuthPreparing': "Waiting for Dreamina to return the authorization link...",
          'waitPreparing': 'Preparing\x20Dreamina\x20login...',
          'modalSynced': 'Dreamina\x20login\x20succeeded.\x20Syncing\x20account\x20status...',
          'modalBrowserFailed': 'The\x20browser\x20could\x20not\x20open\x20automatically.\x20Use\x20the\x20button\x20below\x20to\x20open\x20the\x20authorization\x20page.',
          'modalOAuthStarted': 'The\x20authorization\x20page\x20is\x20ready.\x20Click\x20Open\x20Authorization\x20Page\x20to\x20continue.',
          'modalPendingTooLong': 'Login\x20is\x20taking\x20longer\x20than\x20expected.\x20Confirm\x20that\x20login\x20was\x20completed\x20on\x20the\x20authorization\x20page.',
          'modalQrAbnormal': "QR display failed. Use the OAuth authorization page below.",
          'modalRetryAuth': "Login is not complete. Reopen the authorization page.",
          'modalAuthorizeOnPage': "Open the Dreamina authorization page and confirm login",
          'modalScanQr': "Scan the QR code below with the Douyin app",
          'modalProcessing': 'Processing\x20Dreamina\x20login...',
          'guideCollapse': "Collapse login guide",
          'guideRecommended': "Login guide (recommended)",
          'guide': "Login guide",
          'notLoggedInHint': "Not logged in. Click Log in to use Dreamina.",
          'fetchStatusFailed': 'Failed\x20to\x20get\x20Dreamina\x20status',
          'startFailed': "Failed to start Dreamina login",
          'reloginStarted': "Dreamina re-login started. Open the authorization page and confirm login.",
          'loginStarted': 'Dreamina\x20login\x20started.\x20Open\x20the\x20authorization\x20page\x20and\x20confirm\x20login.',
          'logoutFailed': "Failed to log out of Dreamina",
          'loggedOut': "Logged out of Dreamina"
        })
      })
    }),
    'subscription': Object['freeze']({
      'title': "Subscription",
      'statusLabel': "Subscription status",
      'inactive': "Inactive",
      'loading': 'Syncing...',
      'active': "Active",
      'vipAuthorization': "VIP authorization",
      'annualVipAuthorization': "Annual VIP authorization",
      'expired': "Expired",
      'expirePrefix': "Expires:",
      'inputLabel': "Enter CDKEY",
      'cdkeyPlaceholder': "For example DEMO-V54-365D",
      'contact': "Contact admin for an authorization code",
      'clearAuthorization': "Clear authorization",
      'activateCdkey': "Activate CDKEY",
      'gate': Object["freeze"]({
        'aria': 'Subscription\x20unlock',
        'title': "VIP authorization required",
        'desc': "Contact the admin for an authorization code, or enter a CDKEY to unlock now.",
        'cdkeyPlaceholder': "Enter CDKEY",
        'cancel': "Cancel",
        'activate': "Activate"
      }),
      'contactInfo': Object["freeze"]({
        'wechatLabel': 'WeChat:',
        'wechatAria': "Admin WeChat",
        'qrNotConfigured': "Admin QR code is not configured. Try again later.",
        'qrAlt': "Admin WeChat QR code",
        'qrLoadFailed': 'QR\x20code\x20failed\x20to\x20load.\x20You\x20can\x20copy\x20the\x20WeChat\x20ID\x20instead.'
      }),
      'missingInstallIdSync': "Missing installId, unable to sync subscription status",
      'syncFailed': "Failed to sync subscription status",
      'enterCdkey': "Enter a CDKEY",
      'missingInstallIdActivate': "Missing installId, unable to activate",
      'activationFailed': "CDKEY activation failed",
      'activated': "CDKEY activated",
      'submitted': 'Submitted.\x20Checking\x20authorization...',
      'serverNotConfirmed': "The server has not confirmed activation. Try again later",
      'clearConfirm': "Clear the current authorization? This device will return to inactive status.",
      'clearing': "Clearing...",
      'clearSuccess': "Current authorization cleared",
      'clearFailed': "Failed to clear authorization",
      'checking': 'Checking',
      'gateFailed': 'Activation\x20check\x20failed',
      'activeSyncTip': "Subscription is active. Syncing now, then try again."
    }),
    'shortcuts': Object['freeze']({
      'title': "Keyboard Shortcuts",
      'presetLabel': 'Preset',
      'desc': 'Customize\x20your\x20creation\x20workflow.\x20Click\x20the\x20key\x20for\x20any\x20action\x20below\x20to\x20record\x20a\x20new\x20shortcut.',
      'presets': Object["freeze"]({
        'default': "Default preset",
        'ashuo': "Built-in preset",
        'custom': "Custom"
      }),
      'escExitRecording': "Exit recording",
      'closePanel': "Close panel",
      'resetDefault': "Restore defaults",
      'recording': "Recording...",
      'unset': "Not set",
      'searchPlaceholder': "Search actions, groups, or keys",
      'searchAria': 'Search\x20keyboard\x20shortcuts',
      'noResults': 'No\x20matching\x20shortcuts\x20found',
      'presetSwitched': "Preset switched: {preset}",
      'conflict': "Shortcut conflict: already used by \"{label}\"",
      'updated': 'Shortcut\x20updated',
      'restored': "Default shortcuts restored",
      'groups': Object["freeze"]({
        'general': "General",
        'globalShortcuts': "Global Shortcuts",
        'editSelection': "Edit & Selection",
        'settingToggles': 'Setting\x20Toggles',
        'createNodes': 'Create\x20Nodes',
        'sidebar': "Sidebar",
        'brushTools': "Brush Tools",
        'imageTools': "Image Tools",
        'videoTools': 'Video\x20Tools',
        'audioTools': "Audio Tools",
        'clipTools': "Clip Tools",
        'textTools': 'Text\x20Tools',
        'panoramaStage': "3D Stage",
        'contextCanvas': "Context Menu · Canvas",
        'contextMaterials': "Context Menu · Materials & Files",
        'contextProjects': 'Context\x20Menu\x20·\x20Projects\x20&\x20Workspaces',
        'contextFeatures': "Context Menu · Feature Panels",
        'contextWebPreview': 'Context\x20Menu\x20·\x20Web\x20Preview'
      }),
      'actions': Object["freeze"]({
        'zoom-in': "Zoom in",
        'zoom-out': "Zoom out",
        'fit-all': "Focus nodes / fit canvas",
        'minimap': 'Minimap',
        'pan-canvas': 'Pan\x20canvas\x20(hold)',
        'copy': "Copy",
        'copy-media': "Copy image",
        'cut': 'Cut',
        'canvas-screenshot': 'Canvas\x20screenshot',
        'global-capture-launcher': "Selected text: open canvas actions",
        'global-text-preset': "Selected text: create a preset draft",
        'duplicate-with-edges': "Drag to create linked duplicate",
        'paste': "Paste",
        'undo': 'Undo',
        'redo': "Redo",
        'delete': "Delete",
        'select-all': "Select all",
        'multi-select': 'Multi-select\x20nodes\x20(with\x20click)',
        'group': "Group",
        'align-feature': 'Multi-select\x20alignment',
        'grid-dots': 'Show\x20grid\x20dots',
        'toggle-connection-lines': "Show/hide connection lines",
        'toggle-selection-related-highlight': "Highlight related nodes on click",
        'snap-guides': "Guide snapping",
        'snap-grid': "Grid snapping toggle",
        'toggle-title-follows-zoom': "Titles follow canvas zoom",
        'toggle-media-node-resize': "Image/video node resizing",
        'toggle-prompt-box-resize': "Resizable prompt boxes",
        'toggle-node-avoid-overlap': "Avoid existing nodes",
        'reset-media-size': "Reset node size",
        'add-reference': "Add reference",
        'toggle-agent': "Toggle Canvas AI Agent",
        'create-text': "Create source text node",
        'create-comment-note': "Create comment node",
        'create-ai-text': "Create generated text node",
        'create-ai-image': 'Create\x20generated\x20image\x20node',
        'create-ai-video': 'Create\x20generated\x20video\x20node',
        'create-ai-audio': "Create generated audio node",
        'upload-file': 'Upload\x20file',
        'cut-edge': "Scissors (cut connection)",
        'save': "Save canvas",
        'open-settings': "Open settings",
        'open-canvas-projects': "Open canvas projects",
        'open-assets': "Open materials",
        'open-workflows': "Open workflows",
        'open-node-manager': "Toggle node manager",
        'open-files': 'Open\x20file\x20manager',
        'open-task-center': "Open task center",
        'open-custom-ai-app': "Open custom AI app",
        'escape-all': "Cancel/close all menus and dialogs",
        'editor-tool-brush': 'Brush\x20(toggle\x20mode)',
        'editor-tool-rect': "Rectangle",
        'editor-tool-eraser': "Eraser",
        'editor-tool-bucket': "Paint bucket",
        'editor-clear': "Clear",
        'image-tool-matting': "Mask editor",
        'image-tool-repaint': "Repaint",
        'image-tool-erase': 'Remove',
        'image-tool-hd': 'HD',
        'image-tool-expand': 'Expand\x20image',
        'image-tool-auto-subject': 'Auto-detect\x20subject',
        'image-tool-multigrid': 'Grid\x20crop',
        'image-tool-multiangle': 'Control\x20angle',
        'image-tool-annotate': 'Image\x20editing',
        'image-tool-crop': "Crop",
        'image-tool-fullscreen': "Fullscreen",
        'image-tool-download': "Download",
        'video-tool-clip': "Trim video",
        'video-tool-separate-av': 'Separate\x20audio/video',
        'video-tool-capture-frame': 'Capture\x20current\x20frame',
        'video-tool-keying': "Chroma key",
        'video-tool-hd': 'HD',
        'video-tool-fullscreen': 'Fullscreen',
        'video-tool-download': "Download",
        'ms-sync-video-play': "Sync video playback",
        'audio-tool-clip': "Trim audio",
        'audio-tool-speed': "Speed",
        'audio-tool-download': 'Download',
        'clip-tool-crop': "Clip crop",
        'text-tool-copy': "Copy",
        'text-tool-fullscreen': 'Fullscreen',
        'panorama-scene-tool-toggle-mouse': "Mouse",
        'panorama-scene-tool-move': "Move",
        'panorama-scene-tool-scale': "Scale",
        'panorama-scene-tool-rotate': "Rotate",
        'panorama-scene-reset-view': "Reset view",
        'panorama-scene-capture': 'Screenshot',
        'panorama-scene-camera-create': "Create camera bookmark",
        'panorama-scene-camera-1': "Jump to camera bookmark 1",
        'panorama-scene-camera-2': "Jump to camera bookmark 2",
        'panorama-scene-camera-3': "Jump to camera bookmark 3",
        'panorama-scene-camera-4': "Jump to camera bookmark 4",
        'panorama-scene-camera-5': "Jump to camera bookmark 5",
        'panorama-scene-camera-6': "Jump to camera bookmark 6",
        'panorama-scene-camera-7': "Jump to camera bookmark 7",
        'panorama-scene-camera-8': "Jump to camera bookmark 8",
        'panorama-scene-camera-9': "Jump to camera bookmark 9",
        'panorama-scene-camera-0': "Jump to camera bookmark 10",
        'panorama-scene-camera-save-1': "Save current view to camera bookmark 1",
        'panorama-scene-camera-save-2': "Save current view to camera bookmark 2",
        'panorama-scene-camera-save-3': "Save current view to camera bookmark 3",
        'panorama-scene-camera-save-4': "Save current view to camera bookmark 4",
        'panorama-scene-camera-save-5': "Save current view to camera bookmark 5",
        'panorama-scene-camera-save-6': "Save current view to camera bookmark 6",
        'panorama-scene-camera-save-7': 'Save\x20current\x20view\x20to\x20camera\x20bookmark\x207',
        'panorama-scene-camera-save-8': "Save current view to camera bookmark 8",
        'panorama-scene-camera-save-9': 'Save\x20current\x20view\x20to\x20camera\x20bookmark\x209',
        'panorama-scene-camera-save-0': "Save current view to camera bookmark 10",
        'context-canvas-open-add-node-menu': "Canvas: Add node",
        'context-canvas-open-node-section-generation': 'Canvas:\x20Open\x20generation\x20node\x20category',
        'context-canvas-open-node-section-source': 'Canvas:\x20Open\x20source\x20node\x20category',
        'context-canvas-open-node-section-function': "Canvas: Open function node category",
        'context-canvas-material-comparison': "Canvas: Compare materials",
        'context-canvas-create-collage': 'Canvas:\x20Create\x20collage',
        'context-canvas-add-to-library': 'Canvas:\x20Add\x20to\x20material\x20library',
        'context-canvas-reveal-file': 'Canvas:\x20Open\x20material\x20folder',
        'context-canvas-open-output-folder': "Canvas: Open output folder",
        'context-canvas-duplicate': "Canvas: Duplicate nodes with edges",
        'context-canvas-copy-text': "Canvas: Copy text content",
        'context-canvas-create-connected-ai-text': "Canvas: Connect generated text node",
        'context-canvas-create-connected-ai-image': "Canvas: Connect generated image node",
        'context-canvas-create-connected-ai-video': "Canvas: Connect generated video node",
        'context-canvas-create-connected-ai-audio': "Canvas: Connect generated audio node",
        'context-canvas-open-grid-menu': "Canvas: Create storyboard grid",
        'context-canvas-create-grid-4': "Canvas: Create 4-cell grid",
        'context-canvas-create-grid-9': "Canvas: Create 9-cell grid",
        'context-canvas-create-grid-16': 'Canvas:\x20Create\x2016-cell\x20grid',
        'context-canvas-create-grid-25': "Canvas: Create 25-cell grid",
        'context-canvas-create-source-image': 'Canvas:\x20Create\x20source\x20image\x20node',
        'context-canvas-create-source-video': "Canvas: Create source video node",
        'context-canvas-create-source-audio': "Canvas: Create source audio node",
        'context-canvas-create-panorama-scene': "Canvas: Create 3D stage",
        'context-canvas-create-panorama-360': "Canvas: Create 360 panorama",
        'context-canvas-create-storyboard': 'Canvas:\x20Create\x20storyboard\x20grid\x20node',
        'context-canvas-create-storyboard-script': "Canvas: Create storyboard script node",
        'context-canvas-create-collage-node': "Canvas: Create collage node",
        'context-canvas-create-whiteboard': "Canvas: Create whiteboard node",
        'context-canvas-create-media-clip': 'Canvas:\x20Create\x20media\x20clip\x20node',
        'context-canvas-create-debug': "Canvas: Create debug window",
        'context-align-grid-auto': "Alignment: Auto grid",
        'context-align-grid-2': "Alignment: 2 per row",
        'context-align-grid-3': "Alignment: 3 per row",
        'context-align-grid-4': "Alignment: 4 per row",
        'context-align-grid-5': "Alignment: 5 per row",
        'context-history-add-to-canvas': "File manager: Add to canvas",
        'context-history-fullscreen': "File manager: Fullscreen preview",
        'context-history-reveal': 'File\x20manager:\x20Reveal\x20in\x20folder',
        'context-history-delete': "File manager: Delete",
        'context-material-load-item': "Material library: Add item to canvas",
        'context-material-rename-item': 'Material\x20library:\x20Rename\x20item',
        'context-material-folder-toggle': 'Material\x20library:\x20Expand\x20or\x20collapse\x20folder',
        'context-material-folder-rename': "Material library: Rename folder",
        'context-material-folder-delete': "Material library: Delete folder",
        'context-material-favorite': "Material library: Favorite material",
        'context-material-unfavorite': 'Material\x20library:\x20Unfavorite\x20material',
        'context-material-rename': "Material library: Rename material",
        'context-material-open-move-menu': "Material library: Move to category",
        'context-material-duplicate': 'Material\x20library:\x20Duplicate\x20material',
        'context-material-download': "Material library: Download material",
        'context-material-delete': "Material library: Delete material",
        'context-material-cancel-delete': "Material library: Cancel material deletion",
        'context-material-confirm-delete': "Material library: Confirm material deletion",
        'context-media-clip-export-to-canvas': "Clip material: Export to canvas",
        'context-media-clip-enable-audio': "Clip material: Enable audio",
        'context-media-clip-disable-audio': "Clip material: Disable audio",
        'context-media-clip-delete': "Clip material: Delete",
        'context-project-rename': "Canvas project: Rename",
        'context-project-delete': "Canvas project: Delete",
        'context-canvas-tab-save-as': "Canvas tab: Save as",
        'context-canvas-tab-collect-project': "Canvas tab: Collect project files",
        'context-canvas-tab-delete': "Canvas tab: Delete",
        'context-workspace-open-project': 'Workspace\x20project:\x20Open',
        'context-workspace-rename-project': "Workspace project: Rename",
        'context-workspace-duplicate-project': "Workspace project: Duplicate",
        'context-workspace-collect-project': "Workspace project: Collect",
        'context-workspace-archive-project': "Workspace project: Archive",
        'context-workspace-unarchive-project': 'Workspace\x20project:\x20Unarchive',
        'context-workspace-delete-project': "Workspace project: Delete",
        'context-story-switch-version': 'Story\x20workspace:\x20Switch\x20version',
        'context-story-delete-version': "Story workspace: Delete version",
        'context-story-select-clip': "Story workspace: Select clip",
        'context-story-delete-clip': "Story workspace: Delete clip",
        'context-story-view-asset': "Story workspace: View material",
        'context-story-delete-asset': "Story workspace: Delete material",
        'context-person-switch-result': "Replacement workspace: Switch result",
        'context-person-delete-result': "Replacement workspace: Delete result",
        'context-audio-voice-toggle-imitate-tone': "Voice segment: Imitate tone",
        'context-audio-voice-open-model-menu': "Voice segment: Choose model",
        'context-audio-voice-use-global-model': "Voice segment: Use global model",
        'context-audio-voice-use-generated': "Voice segment: Use generated audio",
        'context-audio-voice-use-source': "Voice segment: Use source audio",
        'context-audio-voice-download-source': 'Voice\x20segment:\x20Download\x20source\x20audio',
        'context-audio-voice-download-generated': "Voice segment: Download generated audio",
        'context-audio-voice-add-source-to-canvas': 'Voice\x20segment:\x20Add\x20original\x20audio\x20to\x20canvas',
        'context-audio-voice-add-generated-to-canvas': "Voice segment: Add converted audio to canvas",
        'context-audio-voice-delete': 'Voice\x20segment:\x20Delete',
        'context-runninghub-load-app': 'Custom\x20AI\x20app:\x20Load',
        'context-runninghub-delete-app': "Custom AI app: Delete",
        'context-runninghub-rename-param': "Custom AI app: Rename parameter",
        'context-runninghub-edit-description': "Custom AI app: Edit description",
        'context-runninghub-choose-control': "Custom AI app: Choose control type",
        'context-runninghub-remove-param': 'Custom\x20AI\x20app:\x20Remove\x20parameter',
        'context-runninghub-remove-input': 'Custom\x20AI\x20app:\x20Remove\x20input',
        'context-task-cancel': "Task center: Cancel task",
        'context-task-reveal': "Task center: Reveal in folder",
        'context-task-copy-error': "Task center: Copy error",
        'context-workflow-details': "Workflow: View details",
        'context-workflow-load': "Workflow: Load to canvas",
        'context-workflow-rename': "Workflow: Rename",
        'context-workflow-edit-meta': "Workflow: Edit information",
        'context-workflow-update-content': "Workflow: Update content",
        'context-workflow-delete': 'Workflow:\x20Delete',
        'context-node-manager-rename': "Node manager: Rename",
        'context-node-manager-download': "Node manager: Download",
        'context-node-manager-delete': 'Node\x20manager:\x20Delete',
        'context-agent-open-image': "Agent: Open image",
        'context-agent-open-history': 'Agent:\x20Open\x20history\x20conversation',
        'context-agent-delete-history': 'Agent:\x20Delete\x20history\x20conversation',
        'context-web-image-add-to-canvas': 'Web\x20preview:\x20Add\x20image\x20to\x20canvas',
        'context-web-image-reverse-create': "Web preview: Reverse prompt and create",
        'context-web-image-reverse-generate': "Web preview: Reverse prompt and generate",
        'context-web-copy-text': 'Web\x20preview:\x20Copy\x20text',
        'context-web-open-text-node-menu': "Web preview: Open text node menu",
        'context-web-text-to-source': "Web preview: Send text to source node",
        'context-web-text-to-generated': "Web preview: Send text to generated text",
        'context-web-open-image-node-menu': 'Web\x20preview:\x20Open\x20image\x20node\x20menu',
        'context-web-text-to-image-create': "Web preview: Create image node from text",
        'context-web-text-to-image-generate': "Web preview: Generate image from text",
        'context-web-open-video-node-menu': "Web preview: Open video node menu",
        'context-web-text-to-video-create': "Web preview: Create video node from text",
        'context-web-text-to-video-generate': 'Web\x20preview:\x20Generate\x20video\x20from\x20text'
      })
    })
  }),
  'saveDialog': Object["freeze"]({
    'title': 'Save\x20Canvas',
    'subtitle': "The file will be saved to the user/Canvas Project/ folder",
    'placeholder': "Enter a canvas name...",
    'cancel': "Cancel",
    'save': "Save"
  }),
  'about': Object["freeze"]({
    'title': 'Canvas\x20AI',
    'tagline': "Carry the story in subtitles, deliver the idea as a finished film",
    'author': "Author:",
    'authorName': 'Canvas AI',
    'bilibili': "Visit Bilibili profile",
    'footer': "© 2026 Canvas AI. All rights reserved."
  }),
  'appPanels': Object["freeze"]({
    'tutorial': Object['freeze']({
      'apiOnboarding': 'Beginner\x20API\x20integration\x20tutorial',
      'bernini': "RH Bernini model detailed usage guide",
      'usage': "Getting started 1",
      'storyStudio': "Story Studio tutorial",
      'replacementStudioFullTutorial': "Replacement Studio complete tutorial",
      'hailuoH3CharacterReplacement': "Hailuo H3 character replacement",
      'minimaxH3MultiPersonLipSync': 'MiniMax\x20H3\x20multi-person\x20lip\x20sync\x20and\x20digital\x20humans',
      'minimaxH3AudioDrivenGeneration': "MiniMax H3 audio-driven generation",
      'fullAudioReferenceVideoGeneration': "Full audio-reference video generation tutorial",
      'rhAiAppComfyUiIntegration': "RH AI app / local and cloud ComfyUI integration tutorial",
      'scail2VoiceStudioFilmRemix': "New efficient film remix workflow with Scail2 + Voice Studio demo",
      'seedanceLineCamera': "Seedance 2.0 line-controlled camera movement workflow",
      'latest': "Game production demo tutorial",
      'scail2FullReview': "Scail2 full review and usage guide",
      'characterReplacement': 'Film\x20character\x20replacement\x20demo',
      'panorama': "Character/scene consistency 360° panorama extraction and SD2.0 generation demo"
    }),
    'aiAssistant': Object["freeze"]({
      'responses': Object["freeze"]({
        'idea': "This is a strong idea. We can combine these elements together.",
        'prompt': "Got it. I will draft a reusable prompt for you first.",
        'connect': "Would you like me to connect this result to the next node automatically?",
        'optimize': "No problem. I am refining the description for your selected area."
      }),
      'greeting': "Hi, I am your AI creation assistant. Share an idea and we can start creating."
    }),
    'emptyHint': Object['freeze']({
      'textNode': 'Generate\x20text',
      'imageNode': "Generate image",
      'videoNode': "Generate video"
    }),
    'devMode': Object["freeze"]({
      'entered': "Developer mode enabled",
      'exited': 'Returned\x20to\x20regular\x20mode',
      'enterAction': "enable developer mode",
      'exitAction': 'return\x20to\x20regular\x20mode',
      'clickHint': 'Click\x20{count}\x20more\x20times\x20to\x20{action}'
    })
  }),
  'taskCenter': Object["freeze"]({
    'resultPreview': "Result preview, {count} results",
    'preparing': "Preparing task",
    'recovering': 'Recovering\x20task',
    'pendingAction': "Working…",
    'actionFailed': "Task action failed",
    'copyTaskIdSuccess': "API task ID copied",
    'ariaLabel': 'Tasks',
    'title': 'Tasks',
    'clearDone': 'Clear\x20done',
    'summary': 'Active\x20{active}\x20·\x20Failed\x20{failed}\x20·\x20Done\x20{done}',
    'unavailableSummary': "Desktop background tasks are unavailable in this environment",
    'unavailable': "Desktop tasks unavailable",
    'empty': "No background tasks",
    'sections': Object["freeze"]({
      'active': "In progress",
      'failed': "Failed",
      'done': "Recently done"
    }),
    'taskKinds': Object["freeze"]({
      'dreaminaVideo': "Dreamina video generation",
      'runningHubWorkflow': "RunningHub workflow",
      'videoPoster': "Generate video poster",
      'audioWaveform': "Generate audio waveform",
      'videoFirstFrame': "Extract first video frame",
      'videoCut': 'Video\x20trim',
      'videoReverse': "Video reverse",
      'audioCut': "Audio trim",
      'videoAudioSeparate': 'Audio\x20separation',
      'videoCompose': "Video compose",
      'videoAudioMux': "Final video mux",
      'audioCompose': "Audio merge",
      'audioVoiceCompose': "Voice Studio compose",
      'mediaTask': "Media task"
    }),
    'statuses': Object["freeze"]({
      'waiting': 'Waiting',
      'untracked': "No longer tracked",
      'processing': 'Processing',
      'complete': "Complete",
      'failed': 'Failed',
      'cancelled': "Cancelled",
      'fallback': "Task"
    }),
    'actions': Object["freeze"]({
      'cancel': "Cancel",
      'reveal': "Reveal file",
      'copyError': "Copy error",
      'locate': "Show source",
      'apiConsole': "API task history",
      'copyTaskId': "Copy task ID"
    }),
    'duration': "Elapsed {duration}",
    'cancelledMessage': 'Cancelled',
    'cancelFailed': "Failed to cancel task",
    'revealFailed': "Failed to reveal file",
    'copyFailed': "Failed to copy",
    'copySuccess': "Error details copied"
  }),
  'nodeToolbar': Object["freeze"]({
    'faceDetect': Object['freeze']({
      'defaultTooltip': "APIMart Seedance 2.0 face detection",
      'passedTooltip': "APIMart Seedance 2.0 face detection passed",
      'failedTooltip': 'Face\x20detection\x20failed',
      'failedTooltipWithError': "Face detection failed: {error}",
      'processingTooltip': "Face detection in progress",
      'missingUrlError': "No detectable asset URL found",
      'missingUrlToast': "Face detection failed: no detectable asset URL found",
      'apiKeyMissing': "APIMART API Key is not configured",
      'running': 'Running\x20APIMart\x20face\x20detection...',
      'passedToast': 'Face\x20detection\x20passed.\x20Seedance\x202.0\x20input\x20URL\x20recorded.',
      'failedFallback': "APIMart face detection failed",
      'failedToastWithError': "Face detection failed: {error}"
    }),
    'autoSubject': Object["freeze"]({
      'buttonTooltip': "Auto-detect subject",
      'modeLabel': 'RH\x20Matting',
      'modeDesc': "RunningHub workflow · One-click subject detection",
      'chooseMode': "Choose detection mode",
      'chooseBackground': 'Choose\x20background\x20color',
      'backgrounds': Object["freeze"]({
        'transparent': "Transparent background",
        'white': "White background",
        'black': "Black background",
        'gray': "Gray background"
      }),
      'cancelledName': 'Subject\x20detection\x20image\x20(cancelled)',
      'cancelledOutput': "Model: {model}\nStatus: cancelled",
      'cancelledToast': 'Subject\x20detection\x20task\x20cancelled',
      'cancelTooltip': "Cancel subject detection",
      'invalidBackground': "Invalid background parameter",
      'outputText': "Model: {model}\nBackground: {background}",
      'noProcessableImage': 'No\x20processable\x20image',
      'apiKeyMissing': "RunningHUB API Key is not configured",
      'sourceNodeMissing': "Source node not found",
      'processingName': "Subject detection image (processing)",
      'uploadFailed': "Image upload failed",
      'createTaskFailed': "Failed to create task",
      'missingResultImage': 'Task\x20completed\x20but\x20did\x20not\x20return\x20an\x20image',
      'resultName': "Subject detection image",
      'failedName': "Subject detection image (failed)",
      'unknownError': "Unknown error",
      'outputTextWithError': "{outputText}\nError: {error}",
      'completed': "Subject detection complete ({background})",
      'failedWithError': "Subject detection failed: {error}"
    }),
    'storyboardScriptAction': Object["freeze"]({
      'videoDefaultPrompt': "Generate a storyboard script from this video and automatically split it into shots based on the content.",
      'missingSource': "Select a connectable text or video node first",
      'invalidConnection': "This node cannot connect to a storyboard script node",
      'missingAddNode': "Failed to create storyboard script node: Store does not support addNode",
      'connectFailed': "Failed to connect storyboard script node"
    }),
    'videoFrameInterpolation': Object["freeze"]({
      'modelLabel': "RH video frame interpolation",
      'processingName': "Frame-interpolated video (processing)",
      'resultName': 'Frame-interpolated\x20video',
      'failedName': 'Frame-interpolated\x20video\x20(failed)',
      'cancelledName': "Frame-interpolated video (cancelled)",
      'outputText': 'Model:\x20{model}\x0aStatus:\x20{status}',
      'outputTextWithError': '{outputText}\x0aError:\x20{error}',
      'status': Object["freeze"]({
        'processing': 'processing',
        'complete': "complete",
        'failed': 'failed',
        'cancelled': 'cancelled'
      }),
      'cancelTooltip': "Cancel frame interpolation",
      'cancelledToast': "Frame interpolation task cancelled",
      'taskCancelled': 'Task\x20cancelled',
      'sourceNodeMissing': 'Source\x20node\x20not\x20found',
      'noProcessableVideo': "No processable video",
      'apiKeyMissing': "RunningHUB API Key is not configured",
      'uploading': "Uploading video to RunningHub...",
      'uploadNoDownloadUrl': "RunningHub upload did not return download_url",
      'processingToast': "Processing frame interpolation...",
      'taskIdMissing': 'Task\x20ID\x20was\x20not\x20returned',
      'missingOutputUrl': "No usable output video URL found",
      'localSaveFailed': 'Generated\x20but\x20local\x20save\x20failed',
      'successToast': "Frame interpolation complete",
      'failedWithError': "Frame interpolation failed: {error}"
    }),
    'videoDepth': Object["freeze"]({
      'modelLabel': "Convert to depth video",
      'processingName': 'Depth\x20video\x20(processing)',
      'resultName': "Depth video",
      'failedName': "Depth video (failed)",
      'cancelledName': "Depth video (cancelled)",
      'outputText': "Model: {model}\nStatus: {status}",
      'outputTextWithError': "{outputText}\nError: {error}",
      'status': Object["freeze"]({
        'processing': "processing",
        'complete': 'complete',
        'failed': "failed",
        'cancelled': "cancelled"
      }),
      'cancelTooltip': 'Cancel\x20depth\x20video\x20conversion',
      'cancelledToast': "Depth video conversion cancelled",
      'sourceNodeMissing': "Source node not found",
      'noProcessableVideo': "No processable video",
      'apiKeyMissing': "RunningHUB API Key is not configured",
      'uploading': 'Uploading\x20video\x20to\x20RunningHub...',
      'processingToast': "Converting depth video...",
      'successToast': 'Depth\x20video\x20conversion\x20complete',
      'failedWithError': "Depth video conversion failed: {error}"
    }),
    'videoHd': Object["freeze"]({
      'choosePlan': "Choose HD Plan",
      'modelFallback': "Video HD",
      'promptLabel': "Video HD restoration",
      'options': Object["freeze"]({
        'sharp': Object["freeze"]({
          'title': 'HD\x20Sharpen',
          'desc': 'RunningHub\x20workflow\x20·\x20Enhance\x20video\x20sharpness'
        }),
        'quality': Object["freeze"]({
          'title': 'HD\x20Quality',
          'desc': "RunningHub workflow · Improve video quality"
        }),
        'basic': Object["freeze"]({
          'title': "Basic HD",
          'desc': "RunningHub workflow · One-click video restoration"
        })
      }),
      'processingName': "HD video (processing)",
      'resultName': "HD video",
      'failedName': "HD video (failed)",
      'cancelledName': "HD video (cancelled)",
      'outputText': 'Model:\x20{model}\x0aPrompt:\x20{prompt}',
      'outputTextWithStatus': "{outputText}\nStatus: {status}",
      'outputTextWithError': '{outputText}\x0aError:\x20{error}',
      'cancelledOutput': "Model: {model}\nPrompt: {prompt}\nStatus: {status}",
      'status': Object['freeze']({
        'cancelled': "cancelled"
      }),
      'cancelTooltip': "Cancel video HD",
      'cancelledToast': "Video HD task cancelled",
      'taskCancelled': 'Task\x20cancelled',
      'sourceNodeMissing': "Source node not found",
      'noProcessableVideo': "No processable video",
      'apiKeyMissing': "RunningHUB API Key is not configured",
      'uploading': "Uploading video to RunningHub...",
      'uploadNoDownloadUrl': 'RunningHub\x20upload\x20did\x20not\x20return\x20download_url',
      'processingToast': "Processing video HD...",
      'taskIdMissing': "Task ID was not returned",
      'missingOutputUrl': 'No\x20usable\x20output\x20video\x20URL\x20found',
      'localSaveFailed': "Generated but local save failed",
      'successToast': "Video HD complete",
      'failedWithError': "Video HD failed: {error}"
    }),
    'imageHd': Object["freeze"]({
      'choosePlan': 'Choose\x20HD\x20Plan',
      'chooseResolution': "Choose upscale resolution",
      'modelLabel': "RH image upscaler",
      'modelDesc': "RunningHub workflow · One-click image upscaling",
      'promptLabel': 'Image\x20upscaling',
      'processingName': "HD image (processing)",
      'resultName': "HD image",
      'failedName': 'HD\x20image\x20(failed)',
      'cancelledName': 'HD\x20image\x20(cancelled)',
      'outputText': 'Model:\x20{model}\x0aPrompt:\x20{prompt}\x0aResolution:\x20{resolution}',
      'outputTextWithStatus': '{outputText}\x0aStatus:\x20{status}',
      'outputTextWithError': '{outputText}\x0aError:\x20{error}',
      'status': Object["freeze"]({
        'cancelled': "cancelled"
      }),
      'cancelTooltip': "Cancel image upscaling",
      'cancelledToast': "Image upscaling task cancelled",
      'taskCancelled': "Task cancelled",
      'noProcessableImage': "No processable image",
      'apiKeyMissing': "RunningHUB API Key is not configured",
      'sourceNodeMissing': 'Source\x20node\x20not\x20found',
      'uploadEmpty': "Image upload failed: processInputImages returned an empty array",
      'uploadFailed': 'Image\x20upload\x20failed',
      'taskIdMissing': 'Task\x20ID\x20was\x20not\x20returned',
      'missingResultImage': "Task completed but did not return an image",
      'unknownError': 'Unknown\x20error',
      'successToast': 'Image\x20upscaling\x20complete',
      'failedWithError': "Image upscaling failed: {error}"
    }),
    'midjourney': Object["freeze"]({
      'modelLabel': 'APIMart\x20Midjourney',
      'variationAction': "MJ variations",
      'hdAction': "MJ HD",
      'chooseVariation': "Choose variation",
      'variationWeakAction': 'Weak\x20variation',
      'variationMediumAction': 'Medium\x20variation',
      'variationStrongAction': 'Strong\x20variation',
      'variationProcessingName': "MJ variations (processing)",
      'hdProcessingName': 'MJ\x20HD\x20(processing)',
      'variationResultName': 'MJ\x20variations',
      'hdResultName': "MJ HD image",
      'failedName': "MJ action (failed)",
      'cancelledName': "MJ action (cancelled)",
      'outputText': "Model: {model}\nAction: {action}\nSource: image {index}",
      'outputTextWithStatus': "{outputText}\nStatus: {status}",
      'outputTextWithError': "{outputText}\nError: {error}",
      'status': Object["freeze"]({
        'cancelled': "cancelled"
      }),
      'busy': "MJ action is already processing",
      'missingContext': "This image has no usable Midjourney action metadata",
      'hdUnsupported': "Midjourney V8.2 does not support MJ HD",
      'hdCustomIdMissing': "Missing MJ HD button metadata. Generate the Midjourney image again and retry.",
      'sourceNodeMissing': "Source node not found",
      'missingResultImage': 'Task\x20completed\x20but\x20did\x20not\x20return\x20an\x20image',
      'unknownError': "Unknown error",
      'successToast': "MJ action complete",
      'pendingToast': "MJ task is still processing. The task node was kept and can be resumed later.",
      'cancelledToast': "MJ action cancelled",
      'failedWithError': "MJ action failed: {error}"
    }),
    'panorama360': Object['freeze']({
      'modelLabel': "RH one-click 360 panorama",
      'processingName': "360 panorama (processing)",
      'resultName': "360 panorama",
      'failedName': "360 panorama (failed)",
      'cancelledName': "360 panorama (cancelled)",
      'outputText': "Model: {model}",
      'outputTextWithStatus': "{outputText}\nStatus: {status}",
      'outputTextWithError': "{outputText}\nError: {error}",
      'status': Object["freeze"]({
        'cancelled': "cancelled"
      }),
      'cancelTooltip': "Cancel 360 panorama",
      'cancelledToast': "360 panorama task cancelled",
      'busy': "360 panorama task is already processing",
      'noProcessableImage': 'No\x20processable\x20image',
      'apiKeyMissing': "RunningHUB API Key is not configured",
      'sourceNodeMissing': 'Source\x20node\x20not\x20found',
      'uploadFailed': "Image upload failed",
      'createTaskFailed': 'Failed\x20to\x20create\x20task',
      'missingResultImage': "Task completed but did not return an image",
      'unknownError': "Unknown error",
      'successToast': "360 panorama complete",
      'pendingToast': "RunningHub is still generating. The task was kept and will continue polling.",
      'failedWithError': "360 panorama generation failed: {error}"
    }),
    'multigrid': Object['freeze']({
      'chooseGrid': "Choose grid",
      'grid4Title': "4-grid",
      'grid4Desc': "2×2 grid",
      'grid9Title': "9-grid",
      'grid9Desc': '3×3\x20grid',
      'grid16Title': "16-grid",
      'grid16Desc': "4×4 grid",
      'grid25Title': "25-grid",
      'grid25Desc': "5×5 grid",
      'crop': "Crop",
      'create': "Create",
      'nodeMissing': "Node data is missing",
      'storyboardName': "Grid storyboard",
      'storyboardCreated': "Storyboard node created",
      'unknownError': 'Unknown\x20error',
      'storyboardFailed': 'Failed\x20to\x20create\x20storyboard:\x20{error}',
      'cropTooltip': "Crop into {count} tiles",
      'cropLoading': 'Loading...',
      'cropSuccess': "Created {count} cropped nodes",
      'cropEmpty': "Crop failed. No nodes were created.",
      'createTooltip': "Create {cols}×{rows} storyboard",
      'createBusy': 'Processing...',
      'customTitle': "Custom",
      'customDesc': "Any size from 1×1 to 5×5",
      'chooseSpec': "Choose size",
      'customBusy': 'Creating\x20{cols}×{rows}',
      'customPreview': "Click to create a {cols}×{rows} storyboard",
      'customMenuTitle': "Custom grid",
      'customAria': "Custom grid size",
      'cellAria': "Create {cols}×{rows} storyboard"
    }),
    'comment': Object["freeze"]({
      'fontSize': "Font size",
      'fontDec': 'Decrease\x20font\x20size',
      'fontInc': "Increase font size",
      'convertMarkdown': 'Convert\x20to\x20Markdown\x20note',
      'convertPlainText': "Switch to plain note",
      'markdownConverted': "Converted to Markdown note",
      'plainTextConverted': 'Switched\x20to\x20plain\x20note',
      'textColor': 'Text\x20color',
      'bgColor': 'Background\x20color',
      'deleteNode': "Delete node",
      'jumpShortcut': "Jump shortcut",
      'jumpShortcutRow': "Shortcut",
      'jumpClear': "Clear shortcut",
      'jumpClearAria': "Clear jump shortcut",
      'jumpHintRecording': 'Press\x20a\x20shortcut,\x20Esc\x20to\x20cancel',
      'jumpEmpty': 'Not\x20set',
      'jumpUpdated': "Jump shortcut updated",
      'jumpCleared': "Jump shortcut cleared",
      'jumpZoom': "Zoom",
      'jumpTooltip': "Jump shortcut | {shortcut}",
      'jumpConflictGlobal': 'Shortcut\x20conflict\x20|\x20Already\x20used\x20by\x20\x22{label}\x22',
      'jumpConflictOther': "Shortcut conflict | Already used by another comment note",
      'textColorLabel': Object["freeze"]({
        'white': "White text",
        'red': "Red text",
        'orange': 'Orange\x20text',
        'yellow': "Yellow text",
        'green': 'Green\x20text',
        'blue': "Blue text",
        'purple': "Purple text",
        'cyan': "Cyan text",
        'pink': "Pink text",
        'gray': "Gray text"
      }),
      'bgColorLabel': Object["freeze"]({
        'transparent': 'Remove\x20background',
        'white': "White background",
        'red': "Red background",
        'orange': "Orange background",
        'yellow': "Yellow background",
        'green': 'Green\x20background',
        'blue': "Blue background",
        'purple': "Purple background",
        'cyan': "Cyan background",
        'gray': "Gray background"
      })
    }),
    'common': Object['freeze']({
      'developmentSuffix': "{text} (In development)",
      'cancelTask': "Cancel task",
      'taskCancelled': "Task cancelled",
      'upload': "Upload",
      'download': 'Download',
      'fullscreen': "Fullscreen",
      'resetSize': "Reset size",
      'nodeMissing': 'Node\x20data\x20is\x20missing',
      'noDownloadableImage': "No downloadable image",
      'noDownloadableVideo': "No downloadable video",
      'imageSaved': "Image saved: {filename}",
      'videoSaved': "Video saved: {filename}",
      'audioSaved': "Audio saved: {filename}"
    }),
    'audio': Object['freeze']({
      'clip': 'Trim\x20audio',
      'separate': 'Separate\x20vocals',
      'voiceStudio': 'Voice\x20Studio',
      'speed': 'Speed'
    }),
    'imageDepth': Object['freeze']({
      'processing': "Depth image (processing)",
      'result': "Depth image",
      'failed': 'Depth\x20image\x20(failed)',
      'cancelled': "Depth image (cancelled)",
      'cancel': "Cancel depth image conversion",
      'missingImage': "Provide a source image",
      'missingWorkflow': "Depth image workflow is not configured",
      'missingKey': 'Configure\x20your\x20RunningHub\x20API\x20key\x20first'
    }),
    'image': Object["freeze"]({
      'localEdit': "Local edit",
      'cancelLocalEdit': "Cancel local edit task",
      'matting': "Mask editor",
      'repaint': "Repaint",
      'depthImage': "Convert to depth image",
      'erase': "Erase",
      'hd': "Enhance",
      'mjVariation': 'MJ\x20variations',
      'mjHd': "MJ HD",
      'expand': 'Expand\x20image',
      'autoSubject': "Auto-detect subject",
      'faceDetectTooltip': "APIMart Seedance 2.0 face detection",
      'faceDetect': "Face detection",
      'panorama360': "One-click 360 panorama",
      'multigrid': "Grid crop",
      'multiangle': 'Control\x20angle',
      'annotate': 'Image\x20editing',
      'crop': "Crop",
      'more': 'More',
      'moreTools': "More tools",
      'customize': "Customize tools",
      'customizeTip': "Drag highlighted buttons to move them outside or into More",
      'done': "Done",
      'doneCustomize': "Done customizing",
      'generate': "Generate",
      'generating': "Generating...",
      'repaintCancelledName': "Repaint result (cancelled)",
      'repaintCancelledOutput': "Model: image repaint\nStatus: cancelled",
      'repaintCancelledToast': "Repaint task cancelled",
      'cancelRepaint': "Cancel repaint",
      'eraseCancelledName': 'Removal\x20result\x20(cancelled)',
      'eraseCancelledOutput': "Model: image removal\nStatus: cancelled",
      'eraseCancelledToast': "Removal task cancelled",
      'cancelErase': 'Cancel\x20erase',
      'expandCancelledName': 'Expanded\x20image\x20(cancelled)',
      'expandCancelledOutput': 'Model:\x20image\x20expansion\x0aStatus:\x20cancelled',
      'expandCancelledToast': 'Image\x20expansion\x20task\x20cancelled',
      'cancelExpand': "Cancel image expansion",
      'rotateCancelledName': 'Rotated\x20image\x20(cancelled)',
      'rotateCancelledOutput': "Model: control angle\nStatus: cancelled",
      'rotateCancelledToast': 'Control\x20angle\x20task\x20cancelled',
      'cancelRotate': "Cancel control angle",
      'taskCancelled': "Task cancelled",
      'localSaveGeneratedFailed': "Generated but local save failed"
    }),
    'video': Object["freeze"]({
      'clip': "Trim video",
      'segmentRetake': "Segment retake",
      'voiceReplace': "Voice Studio",
      'reverse': 'Reverse\x20video',
      'reverseBusyTooltip': "{tooltip}...",
      'reverseUnavailable': "Video reverse is unavailable",
      'reverseFailed': "Video reverse failed",
      'reverseFailedWithError': "Video reverse failed: {error}",
      'keying': "Keying",
      'storyboardScript': "Storyboard script",
      'faceDetectTooltip': "APIMart Seedance 2.0 face detection",
      'faceDetect': "Face detection",
      'toGif': "Convert to GIF",
      'hd': 'Enhance',
      'depthVideo': "Convert to depth video",
      'frameInterpolation': 'Frame\x20interpolation',
      'remove': "Video erase",
      'separateAv': "Separate audio/video",
      'more': "More",
      'moreTools': "More tools",
      'customize': "Customize tools",
      'customizeTip': "Drag highlighted buttons to move them outside or into More",
      'exitCurrentEditMode': "Exit the current video editing mode first",
      'exitKeyingMode': "Exit keying mode first",
      'exitClipMode': "Exit video trim mode first",
      'cancelKeyingTask': 'Cancel\x20keying\x20task',
      'cancelRemoveTask': "Cancel video erase",
      'extractKeyframes': 'Extract\x20keyframes',
      'extractUnavailable': "Keyframe extraction is unavailable",
      'extractPreparing': "Extract keyframes: preparing",
      'extractProgress': 'Extract\x20keyframes:\x20{progress}',
      'extractStarted': "Analyzing scenes and extracting keyframes...",
      'extractNoSegments': 'No\x20scene\x20changes\x20detected',
      'extractNoKeyframes': 'Smart\x20clip\x20did\x20not\x20create\x20valid\x20keyframes',
      'extractComplete': "Smart clip complete. Created {count} keyframes",
      'smartClipFailed': "Smart clip failed",
      'extractFailed': 'Failed\x20to\x20extract\x20keyframes:\x20{error}',
      'invalidVideoSource': "Invalid video source",
      'analyzingScenes': "Analyzing video scenes...",
      'sourceNodeMissing': 'Source\x20node\x20not\x20found',
      'sceneNodeName': "Scene {index}",
      'sceneNodesCreated': "Created {count} scene nodes",
      'smartClipFailedRetry': "Smart clip failed. Please try again.",
      'durationLimit': "Videos must be {seconds} seconds or shorter. Trim the video first.",
      'hdVipRequired': "This HD model requires VIP access",
      'saveInvalidUrl': "Save failed: invalid video URL",
      'saveEmptyDownload': "Save failed: downloaded video is empty",
      'saveMalformed': 'Local\x20save\x20failed:\x20invalid\x20response\x20format',
      'savingLocal': "Saving locally…",
      'localSaveFailed': 'Local\x20save\x20failed'
    }),
    'text': Object["freeze"]({
      'copy': "Copy",
      'copied': "Copied",
      'copyFailed': "Copy failed",
      'noTextToCopy': 'No\x20text\x20to\x20copy',
      'clearEmptyLines': 'Clear\x20empty\x20lines',
      'storyboardScript': "Storyboard script",
      'fullscreen': "Fullscreen",
      'noTextToClean': "No text to clean",
      'noBlankLines': "No empty lines detected",
      'clearedBlankLines': "Empty lines cleared",
      'close': 'Close',
      'heading1': "Heading 1",
      'heading2': "Heading 2",
      'heading3': 'Heading\x203',
      'paragraph': 'Body\x20text',
      'bold': "Bold",
      'italic': "Italic",
      'unorderedList': "Unordered list",
      'orderedList': "Ordered list",
      'divider': "Divider"
    })
  }),
  'segmentRetake': Object['freeze']({
    'nodeName': 'Segment\x20retake',
    'timeline': Object["freeze"]({
      'label': "Segment retake timeline"
    }),
    'annotate': Object["freeze"]({
      'button': "Annotate current frame",
      'placeholder': "Describe the requested change",
      'cancel': "Cancel",
      'confirm': "Confirm"
    }),
    'smart': Object["freeze"]({
      'button': "Smart trim",
      'analyzing': "Analyzing…",
      'segment': 'Segment\x20{index}\x20·\x20{start}–{end}'
    }),
    'marker': Object["freeze"]({
      'label': "Frame annotation at {time}",
      'delete': 'Delete\x20annotation'
    }),
    'errors': Object["freeze"]({
      'invalidSource': "The current video source is unavailable",
      'durationTooShort': "Seedance 2.5 editing requires at least 4 seconds of video",
      'createFailed': 'Failed\x20to\x20create\x20the\x20segment\x20retake\x20node',
      'frameNotReady': 'The\x20current\x20video\x20frame\x20is\x20not\x20ready',
      'annotationFailed': 'Failed\x20to\x20save\x20the\x20frame\x20annotation',
      'smartFailed': "Smart trim analysis failed",
      'rangeTooShort': "The retake range cannot be shorter than 4 seconds",
      'rangeTooLong': 'The\x20retake\x20range\x20cannot\x20exceed\x2030\x20seconds',
      'annotationOutsideRange': "A frame annotation is outside the current I/O range. Adjust the range or delete the red marker.",
      'clipUnavailable': "Could not prepare the video input for segment retake",
      'rangeChanged': "The I/O range changed while trimming. Generate again.",
      'unsupportedModel': "Segment retake currently supports only Seedance 2.5 models"
    })
  }),
  'videoClip': Object["freeze"]({
    'controls': Object['freeze']({
      'cancel': 'Cancel',
      'done': "Done",
      'start': "Start",
      'loading': "Loading..."
    }),
    'errors': Object["freeze"]({
      'videoNodeMissing': "Video node not found",
      'invalidSource': "Invalid video source",
      'smartClipEndpointMissing': 'Backend\x20endpoint\x20missing:\x20/api/v2/video/smart_clip\x20(restart\x20server.py)',
      'cutEndpointMissing': "Backend endpoint missing: /api/v2/video/cut (restart server.py)",
      'startFailed': "Failed to start",
      'startMissingJobId': "Failed to start: missing jobId",
      'exitedClipMode': "Exited trim mode",
      'smartClipFailed': 'Smart\x20clip\x20failed',
      'sourceNodeMissing': "Source node not found",
      'cutFailed': 'Video\x20trim\x20failed'
    }),
    'smartClip': Object["freeze"]({
      'stages': Object["freeze"]({
        'prepare': 'Preparing',
        'detect': "Analyzing",
        'cut': "Trimming",
        'frame': "Extracting frames",
        'processing': "Processing"
      }),
      'preparing': "Preparing...",
      'progressWithTotal': "{stage} {done}/{total} ({pct}%)",
      'progressPercent': "{stage} ({pct}%)",
      'extractingFrame': "Extracting frame {current}/{total}",
      'keyframeNodeName': 'Smart\x20clip\x20keyframe\x20{index}',
      'segmentNodeName': "Smart clip {index}",
      'startedKeyframes': "Analyzing scenes and extracting keyframes...",
      'startedSegments': "Analyzing scenes and trimming video clips...",
      'noSegments': "No scene changes detected",
      'noKeyframes': "Smart clip did not create valid keyframes",
      'noResults': 'Smart\x20clip\x20did\x20not\x20create\x20valid\x20clips',
      'completeKeyframes': "Smart clip complete. Created {count} keyframes",
      'completeSegments': "Smart clip complete. Created {count} clips",
      'failedWithError': "Smart clip failed: {error}"
    }),
    'helper': Object['freeze']({
      'cancel': "Cancel",
      'rangePlayPause': "Play/pause selected range",
      'moveSelectionByFrame': "Move trim range frame by frame",
      'moveSelectionByLargeStep': "Move trim range by {frames} frames",
      'setInOut': "Set in/out points",
      'fineTuneInPoint': "Fine-tune in point ({frames} frame)",
      'fineTuneOutPoint': "Fine-tune out point ({frames} frame)",
      'wheelKey': "Wheel",
      'wheelMove': "Same as arrow keys (scroll up = ←)",
      'clickKey': 'Click',
      'jumpPlayhead': "Move playhead",
      'doubleClickRangeKey': "Double-click range",
      'resetDefaultRange': "Reset to default {seconds}s"
    }),
    'smartPanel': Object["freeze"]({
      'smartClipButton': "Smart clip",
      'extractFrame': "Extract video frame",
      'title': "Smart Clip Settings",
      'output': "Output",
      'outputTip': "Extract video clips: create video nodes\nExtract keyframes: take the first frame of each segment and create image nodes",
      'outputSegments': "Extract video clips",
      'outputKeyframes': "Extract keyframes",
      'mode': "Mode",
      'modeTip': 'Stable:\x20cleaner\x20results\x20for\x20talking-head\x20or\x20cinematic\x20footage\x0aBalanced:\x20cuts\x20more\x20shots\x0aSensitive:\x20better\x20for\x20fast\x20edits\x20and\x20montages',
      'modeStable': 'Stable',
      'modeBalanced': "Balanced",
      'modeSensitive': 'Sensitive',
      'fps': "Frame rate",
      'fpsTip': "16 fps is faster, 24 fps is versatile, 30 fps is smoother but slower",
      'fpsValue': "{fps} fps",
      'maxSegments': "Max output",
      'maxSegmentsTip': "Generate up to {max} clips to avoid flooding the canvas\nDrag the number left or right, or click to type",
      'maxSegmentsAria': "Maximum generated segments",
      'segmentUnit': 'clips',
      'hintDefault': "Very dense shots will be downgraded automatically so results can still be generated",
      'hintKeyframes': 'Keyframe\x20mode\x20creates\x20an\x20image\x20from\x20the\x20first\x20frame\x20of\x20each\x20segment'
    }),
    'cut': Object['freeze']({
      'processing': "Trimming video on the backend...",
      'videoFallback': "Video",
      'newNodeName': "Trimmed from {name}",
      'success': "Video trimmed. A new file was created.",
      'failedWithError': 'Video\x20trim\x20failed:\x20{error}',
      'cancelled': "Video trim cancelled"
    })
  }),
  'nodeMenu': Object["freeze"]({
    'addNodes': 'Add\x20nodes',
    'addResources': "Add resources",
    'upload': "Upload",
    'text': "Text",
    'image': "Image",
    'video': "Video",
    'testVideo': "Test video",
    'audio': 'Audio',
    'mediaClip': "Clip",
    'collage': "Collage",
    'panoramaScene': '3D\x20Stage',
    'panorama360': "360 Panorama",
    'storyboardScript': "Storyboard"
  }),
  'storyboard': Object["freeze"]({
    'toolbar': Object["freeze"]({
      'toggleAspect': "Switch aspect ratio",
      'aspectLabel': "Aspect {aspectRatio}",
      'toggleGrid': "Switch grid",
      'gridLabel': "Grid {cols}×{rows}",
      'adjustSplitLines': 'Adjust\x20split\x20lines',
      'applying': "Applying",
      'applyingSplitLines': "Applying split lines",
      'finishAdjust': "Finish adjustment",
      'finishAdjustSplitLines': "Finish split-line adjustment",
      'edit': 'Edit\x20storyboard',
      'exitEdit': "Exit storyboard editing",
      'editShort': 'Edit',
      'exitEditShort': "Exit",
      'compose': "Compose",
      'clear': "Clear",
      'expand': "Expand",
      'collapse': "Collapse",
      'customGridHint': 'Drag\x20split\x20lines\x20to\x20adjust\x20the\x20crop.\x20Press\x20Esc\x20to\x20cancel.',
      'editHint': "Drag cells to swap them, or drag out to create a new image.",
      'enterEditHint': "Double-click to edit storyboard",
      'customGridPartialRefreshFailed': "Custom split saved, but some cells failed to refresh."
    }),
    'cell': Object['freeze']({
      'loadFailed': "Load failed",
      'dropImage': 'Drop\x20image'
    }),
    'imageRuntime': Object["freeze"]({
      'sourceImageLoadFailed': 'Source\x20image\x20failed\x20to\x20load'
    })
  }),
  'storyboardScript': Object["freeze"]({
    'defaultName': "Storyboard",
    'loading': "Generating storyboard script",
    'mediaModeAria': "Storyboard script generation mode",
    'mediaMode': Object["freeze"]({
      'image': "Image prompts",
      'video': "Video prompts"
    }),
    'viewModeAria': "Storyboard script view",
    'viewMode': Object["freeze"]({
      'list': "List view",
      'card': "Card view"
    }),
    'promptPlaceholder': 'Enter\x20a\x20story,\x20copy,\x20or\x20storyboard\x20requirements',
    'generate': "Generate",
    'advancedSettings': "Advanced settings",
    'selectionCount': "{selected} selected, {total} shots total",
    'selectAllAria': "Select all shots",
    'selectRowAria': "Select shot {index}",
    'shotFallback': "Shot {index}",
    'imageBatchGroupName': "Storyboard image generation",
    'imageNodeName': 'Storyboard\x20{shot}',
    'columns': Object['freeze']({
      'shotNo': "Shot",
      'duration': "Duration",
      'shotSize': "Shot size",
      'scene': "Scene",
      'visualDescription': "Visual description",
      'character': 'Character',
      'characterDescription': "Character description",
      'characterAction': 'Character\x20action',
      'emotion': "Emotion",
      'characterImage': 'Character\x20image',
      'reference': "Reference",
      'imagePrompt': "Image prompt",
      'videoPrompt': "Video prompt",
      'dialogue': 'Dialogue',
      'soundEffect': "Sound effect"
    }),
    'toolbar': Object["freeze"]({
      'editMode': "Edit/generate storyboard",
      'exitEdit': "Exit editing",
      'generateSelected': "Generate selected shots",
      'fullscreen': 'Fullscreen',
      'download': "Download",
      'downloadTable': 'Download\x20table',
      'queue': "Add to queue"
    }),
    'fullscreen': Object["freeze"]({
      'close': "Close fullscreen",
      'aria': 'Storyboard\x20script\x20fullscreen\x20view',
      'meta': "{count} shots · {media} · {view}"
    }),
    'empty': Object["freeze"]({
      'title': 'No\x20storyboard\x20script\x20yet',
      'hint': 'Select\x20the\x20node,\x20then\x20enter\x20a\x20story\x20or\x20copy\x20in\x20the\x20prompt\x20bar\x20to\x20generate\x20one.'
    }),
    'toasts': Object['freeze']({
      'generateScriptFirst': "Generate a storyboard script first",
      'noFullscreenData': "No storyboard script available for fullscreen",
      'missingPromptOrReference': "Enter a story, copy, or connect reference images/videos before generating",
      'selectStoryboardsFirst': "Select the shots to generate first",
      'missingImagePrompt': "Selected shots are missing image prompts. Complete them before generating.",
      'createdAndStartedImageNodes': "Created and started {count} image nodes",
      'createdImageNodes': "Created {count} image generation nodes",
      'autoStartPartialFailed': 'Some\x20image\x20nodes\x20were\x20created,\x20but\x20automatic\x20generation\x20did\x20not\x20start',
      'noDownloadData': "No storyboard script available to download",
      'downloadedTable': "Storyboard script table downloaded"
    }),
    'errors': Object['freeze']({
      'invalidJsonTooManyFrames': 'The\x20model\x20did\x20not\x20return\x20valid\x20storyboard\x20JSON.\x20Try\x20again\x20or\x20reduce\x20the\x20number\x20of\x20video\x20slices.',
      'invalidJsonSwitchModel': "The model did not return valid storyboard JSON. Try again or switch the Volcengine model.",
      'videoPreprocessFailed': "Video storyboard preprocessing failed",
      'generationFailed': 'Storyboard\x20script\x20generation\x20failed'
    })
  }),
  'promptExpansion': Object["freeze"]({
    'expand': "Expand prompt",
    'collapse': "Collapse prompt (Esc)",
    'title': 'Prompt\x20editor'
  }),
  'promptPresets': Object["freeze"]({
    'userInputPill': "Prompt",
    'triggerLabel': "Prompt presets (or type /)",
    'templatePlaceholder': 'Example:\x20generate\x20full-body\x20three\x20views\x20with\x20front,\x2045-degree\x20side,\x20back\x20views,\x20clean\x20background,\x20character\x20reference',
    'customGroupTitle': "User custom",
    'customGroupDesc': "Saved custom presets",
    'customPresetFallback': "Custom preset",
    'customPresetFallbackWithIndex': 'Custom\x20preset\x20{index}',
    'presetDescFallback': 'Add\x20a\x20description\x20and\x20prompt\x20template',
    'slash': Object["freeze"]({
      'header': "Choose a preset",
      'subItemsDesc': "Includes multiple options",
      'customTitle': "Custom presets",
      'customBadge': "Manage",
      'customDesc': "Edit or create presets for this node"
    }),
    'nodeTypes': Object["freeze"]({
      'image': "Image node",
      'text': 'Text\x20node',
      'video': "Video node",
      'audio': 'Audio\x20node',
      'storyboardScript': 'Storyboard\x20script\x20node',
      'node': "Node"
    }),
    'tabs': Object["freeze"]({
      'text': Object["freeze"]({
        'label': "Text presets"
      }),
      'image': Object["freeze"]({
        'label': "Image presets"
      }),
      'video': Object["freeze"]({
        'label': "Video presets"
      }),
      'audio': Object["freeze"]({
        'label': "Audio presets"
      }),
      'storyboardScript': Object["freeze"]({
        'label': "Storyboard script presets"
      })
    }),
    'manager': Object["freeze"]({
      'title': "User presets",
      'desc': 'Manage\x20generation\x20presets\x20for\x20{nodeType}',
      'close': "Close",
      'new': "New",
      'emptyList': "Click New on the left to create a custom preset.",
      'emptyDetail': "Select a preset on the left, or click New to start editing.",
      'deleteAria': "Delete {title}",
      'quickCaptureDefaultSet': "{preset} is now the default tab for global text capture",
      'quickCaptureDefaultFailed': "Failed to save the default preset tab",
      'quickCaptureDefaultAria': "{preset}, default tab for global text capture",
      'quickCaptureSetAria': "{preset}, right-click to set as the global text capture default"
    }),
    'editor': Object['freeze']({
      'name': "Name",
      'namePlaceholder': "Preset name",
      'desc': 'Description',
      'descPlaceholder': "Describe when this preset is useful",
      'template': "Prompt template",
      'insertPrompt': "Insert prompt field content",
      'save': "Save",
      'saving': "Saving...",
      'titleRequired': "Enter a preset name",
      'templateRequired': 'Enter\x20preset\x20content',
      'saved': "Custom preset saved",
      'saveFailed': "Failed to save custom preset",
      'duplicateUserInput': "A preset can include the prompt field only once"
    }),
    'triggerModes': Object["freeze"]({
      'aria': "Preset trigger mode",
      'label': "Mode:",
      'direct': "Run directly",
      'insertPrompt': 'Add\x20to\x20prompt'
    }),
    'thumbnail': Object["freeze"]({
      'upload': "Upload thumbnail",
      'updated': 'Thumbnail\x20updated.\x20Save\x20to\x20apply\x20it.',
      'chooseImage': 'Choose\x20an\x20image\x20file',
      'readFailed': "Failed to read thumbnail",
      'uploadFailed': "Failed to upload thumbnail"
    }),
    'delete': Object['freeze']({
      'deleted': 'Custom\x20preset\x20deleted',
      'failed': "Failed to delete custom preset"
    }),
    'emptyInput': Object["freeze"]({
      'image': "Enter a prompt or add a reference image",
      'panorama': "Enter a scene or add a reference image"
    }),
    'presets': Object['freeze']({
      'sceneReferenceGroup': Object['freeze']({
        'title': 'Scene\x20reference',
        'desc': "Generate scene multi-views and panoramas in one click"
      }),
      'sceneFourView': Object["freeze"]({
        'title': "Scene four views",
        'desc': 'Generate\x20scene\x20multi-views\x20in\x20one\x20click',
        'template': "{用户输入}, create a four-view scene reference sheet with no characters unless requested. Include a top plan view, a 45-degree axonometric view, and multiple orthographic elevation views. Keep the same space, materials, props, and lighting across all panels."
      }),
      'sceneNineView': Object["freeze"]({
        'title': "Scene nine views",
        'desc': "Nine continuous multi-view design panels for one scene",
        'template': 'User\x20description:\x20{用户输入\x20||\x20the\x20scene\x20shown\x20in\x20the\x20reference\x20image}\x0aCreate\x20a\x203x3\x20multi-view\x20scene\x20design\x20sheet\x20for\x20the\x20same\x20location,\x20not\x20nine\x20different\x20locations.\x20Keep\x20layout,\x20major\x20objects,\x20materials,\x20and\x20lighting\x20consistent.\x20Show\x20front\x20wide\x20view,\x20entrance\x20wide\x20view,\x20main\x20subject\x20medium\x20view,\x20main\x20subject\x20closeup,\x20left\x2045-degree\x20view,\x20right\x2045-degree\x20view,\x20low-angle\x20view,\x20high-angle\x20view,\x20and\x20rear\x20reverse\x20view.\x20Add\x20concise\x20English\x20view\x20labels\x20only.'
      }),
      'panorama360': Object["freeze"]({
        'title': '360°\x20seamless\x20panorama',
        'desc': 'Generate\x20a\x20seamless\x20360°\x20panorama\x20for\x20VR\x20viewing',
        'imageInputTemplate': "360-degree equirectangular panorama, spherical panorama for VR viewing, seamless wrap-around environment based on the reference image scene {用户输入}",
        'textInputTemplate': '360-degree\x20equirectangular\x20panorama,\x20spherical\x20panorama\x20for\x20VR\x20viewing,\x20seamless\x20wrap-around\x20environment.\x20Scene:\x20{用户输入}'
      }),
      'hailuoH3Group': Object['freeze']({
        'title': "Hailuo H3",
        'desc': 'Standard\x20video\x20prompt\x20presets'
      }),
      'hailuoH3StandardPrompt': Object["freeze"]({
        'title': "Standard prompt",
        'desc': "15-second two-character suspense short-drama reference example"
      }),
      'minimaxH3Group': Object["freeze"]({
        'title': "Hailuo H3 Video Edit",
        'desc': "Character-replacement prompt presets"
      }),
      'minimaxH3FullCharacterReplacement': Object["freeze"]({
        'title': "Full character replacement",
        'desc': "Replace the character's complete appearance and outfit"
      }),
      'minimaxH3GeneralCharacterReplacement': Object["freeze"]({
        'title': "General character replacement",
        'desc': "General identity and motion-preservation prompt"
      }),
      'minimaxH3CharacterAndBackgroundReplacement': Object["freeze"]({
        'title': "Character + background replacement",
        'desc': 'Preserve\x20the\x20reference\x20character\x20and\x20scene\x20while\x20transferring\x20motion'
      }),
      'minimaxH3UniversalObjectReplacement': Object["freeze"]({
        'title': "Universal object replacement",
        'desc': "Replace one object while preserving the scene"
      }),
      'minimaxH3HandheldItemReplacement': Object["freeze"]({
        'title': "Handheld item replacement",
        'desc': "Replace a held item with a natural grip"
      }),
      'minimaxH3VehicleReplacement': Object["freeze"]({
        'title': 'Vehicle\x20replacement',
        'desc': "Replace a moving vehicle with realistic motion"
      }),
      'minimaxH3MultiPersonReplacement': Object["freeze"]({
        'title': "Multi-person replacement",
        'desc': "Replace two specified people in sync"
      }),
      'minimaxH3ClothingOnlyReplacement': Object["freeze"]({
        'title': 'Clothing-only\x20replacement',
        'desc': "Replace only the main character's clothing"
      }),
      'minimaxH3ClothingAndHairstyleReplacement': Object["freeze"]({
        'title': "Clothing + hairstyle replacement",
        'desc': "Replace only the main character's clothing and hairstyle"
      }),
      'minimaxH3ReplaceOneOfTwoPeople': Object['freeze']({
        'title': "Replace one of two people",
        'desc': "Replace only the specified person on the left"
      }),
      'hailuoH3AudioDrivenGroup': Object['freeze']({
        'title': "Hailuo H3 Audio Driven",
        'desc': "Voice-driven video prompt presets"
      }),
      'hailuoH3AudioPromptVideo': Object["freeze"]({
        'title': "Audio + prompt to video",
        'desc': 'Generate\x20video\x20visuals\x20from\x20an\x20audio\x20timeline\x20and\x20prompt'
      }),
      'hailuoH3AudioImageLipSync': Object['freeze']({
        'title': "Audio + image lip-sync video",
        'desc': "Animate a reference-image character in sync with the audio"
      }),
      'hailuoH3AudioVideoLipSync': Object['freeze']({
        'title': "Audio + video character lip-sync",
        'desc': "Keep the source video and sync the specified character"
      }),
      'hailuoH3AudioImageVideoMotionTransfer': Object["freeze"]({
        'title': 'Audio\x20+\x20image\x20+\x20video\x20motion\x20transfer',
        'desc': 'Use\x20the\x20image\x20for\x20visuals\x20and\x20the\x20video\x20for\x20motion\x20and\x20camera'
      }),
      'doubaoAudio1Group': Object["freeze"]({
        'title': "Doubao Audio 1.0",
        'desc': 'Cinematic\x20dialogue,\x20music,\x20ambience,\x20and\x20Foley\x20presets'
      }),
      'doubaoAudio1TextGenerationGroup': Object["freeze"]({
        'title': "Text generation",
        'desc': "Story dialogue, podcast, and news narration examples"
      }),
      'doubaoAudio1ReferenceGenerationGroup': Object['freeze']({
        'title': 'Reference\x20generation',
        'desc': "Recreate or perform a vocal style from reference audio"
      }),
      'doubaoAudio1TimingControlGroup': Object["freeze"]({
        'title': "Timing control",
        'desc': "Use timestamps to control effects, emotion, and narration"
      }),
      'doubaoAudio1MultilingualGroup': Object["freeze"]({
        'title': "Multilingual",
        'desc': "Multilingual dialogue and announcement examples"
      }),
      'doubaoAudio1CrimeSuspense': Object["freeze"]({
        'title': "Crime suspense",
        'desc': 'Two\x20male\x20voices\x20with\x20comic\x20music\x20and\x20layered\x20Foley'
      }),
      'doubaoAudio1PalaceMedicineTrial': Object["freeze"]({
        'title': "Palace medicine trial",
        'desc': "Court ensemble dialogue, tense music, and action sounds"
      }),
      'doubaoAudio1LingshanDeclaration': Object["freeze"]({
        'title': 'Lingshan\x20declaration\x20of\x20war',
        'desc': "Mythic ensemble dialogue, magic impacts, and tense music"
      }),
      'doubaoAudio1PeriodComedy': Object['freeze']({
        'title': "Period comedy",
        'desc': "Two-man period comedy dialogue with cartoon Foley"
      }),
      'doubaoAudio1FutureSciFi': Object["freeze"]({
        'title': "Futuristic sci-fi",
        'desc': "Crisis narration, announcements, and electronic ambience"
      }),
      'doubaoAudio1TwoHostPodcast': Object["freeze"]({
        'title': "Two-host podcast",
        'desc': "Natural pauses, acknowledgements, and conversational pacing"
      }),
      'doubaoAudio1FireSceneInvestigation': Object["freeze"]({
        'title': 'Fire\x20scene\x20investigation',
        'desc': "News narration, eyewitness testimony, and fire-scene audio"
      }),
      'doubaoAudio1SuspenseInvestigation': Object['freeze']({
        'title': "Suspense investigation",
        'desc': 'Solo\x20investigative\x20narration,\x20clue\x20progression,\x20and\x20ambience'
      }),
      'doubaoAudio1LiMiMemory': Object["freeze"]({
        'title': "Li Mi's Memory",
        'desc': "Reference-audio style performance example"
      }),
      'doubaoAudio1LivestreamDuo': Object['freeze']({
        'title': "Two-host livestream",
        'desc': "Two-host livestream reference-audio example"
      }),
      'doubaoAudio1PoliceStationConfrontation': Object["freeze"]({
        'title': 'Police\x20station\x20confrontation',
        'desc': "Confrontation dialogue reference-generation example"
      }),
      'doubaoAudio1PodcastChat': Object["freeze"]({
        'title': "Podcast chat",
        'desc': "Podcast conversation reference-generation example"
      }),
      'doubaoAudio1MultiRolePerformance': Object["freeze"]({
        'title': 'Multi-role\x20performance',
        'desc': "Multi-role reference-audio performance example"
      }),
      'doubaoAudio1SoundEffectTiming': Object["freeze"]({
        'title': "Control sound-effect timing",
        'desc': "Sound-effect timing control template"
      }),
      'doubaoAudio1EmotionProgression': Object["freeze"]({
        'title': "Control emotional progression",
        'desc': "Emotional progression timing template"
      }),
      'doubaoAudio1NarrativeTransition': Object['freeze']({
        'title': "Control narrative transitions",
        'desc': "Narrative transition timing template"
      }),
      'doubaoAudio1NarrationProgression': Object['freeze']({
        'title': "Control narration pacing",
        'desc': "Narration pacing control template"
      }),
      'doubaoAudio1French': Object["freeze"]({
        'title': "French",
        'desc': 'French\x20generation\x20template'
      }),
      'doubaoAudio1Japanese': Object["freeze"]({
        'title': "Japanese",
        'desc': "Japanese generation template"
      }),
      'doubaoAudio1Korean': Object['freeze']({
        'title': "Korean",
        'desc': 'Korean\x20generation\x20template'
      }),
      'doubaoAudio1English': Object["freeze"]({
        'title': 'English',
        'desc': "English generation template"
      }),
      'characterReferenceGroup': Object["freeze"]({
        'title': "Character reference",
        'desc': "Generate character multi-views, three views, face closeups, and design breakdowns"
      }),
      'characterThreeView': Object["freeze"]({
        'title': "Character three views",
        'desc': "Clean three-direction character view sheet",
        'template': 'Create\x20a\x20full-body\x20character\x20three-view\x20sheet\x20for\x20{用户输入\x20||\x20a\x20character\x20on\x20a\x20neutral\x20gray\x20background}.\x20Include\x20front\x20view,\x2045-degree\x20side\x20view,\x20and\x20back\x20view.\x20Keep\x20outfit,\x20hairstyle,\x20body\x20proportions,\x20colors,\x20and\x20facial\x20identity\x20consistent.\x20Clean\x20layout,\x20professional\x20character\x20design\x20sheet.'
      }),
      'characterThreeViewFace': Object["freeze"]({
        'title': 'Character\x20three\x20views\x20+\x20face',
        'desc': "Three-view sheet with a face closeup",
        'template': 'Create\x20a\x20full-body\x20character\x20three-view\x20sheet\x20plus\x20one\x20face\x20closeup\x20for\x20{用户输入\x20||\x20a\x20character\x20on\x20a\x20neutral\x20gray\x20background}.\x20Use\x20the\x20left\x20third\x20for\x20the\x20upper-body\x20face\x20closeup\x20and\x20the\x20right\x20two\x20thirds\x20for\x20front,\x2045-degree\x20side,\x20and\x20back\x20views.\x20Keep\x20identity,\x20outfit,\x20hairstyle,\x20and\x20proportions\x20consistent.'
      }),
      'characterFrontBackViewFace': Object["freeze"]({
        'title': "Front and back views + face",
        'desc': "Face closeup with headless front and back full-body views",
        'template': "Professional character asset page layout. The left side presents a large, highly detailed close-up portrait of the character's face, highlighting the hairstyle, eyes, skin texture, makeup, and expression. The right side presents two full-body views of the same female character, from the front and back respectively, emphasizing the clothing, silhouette, proportions, and boots. Crop out the head and do not show it, keeping the focus on the body and costume design. Use a clean, seamless white background with minimalist styling, modern editorial layout, and tidy negative space.\n\n{用户输入}"
      }),
      'characterAnalysis': Object["freeze"]({
        'title': "Character design breakdown",
        'desc': "A design sheet with detail callouts",
        'template': 'Create\x20a\x20character\x20design\x20breakdown\x20sheet\x20for\x20{用户输入\x20||\x20a\x20character\x20on\x20a\x20neutral\x20gray\x20background}.\x20Include\x20front,\x20side,\x20and\x20back\x20views,\x20face\x20feature\x20closeups,\x20costume\x20material\x20details,\x20accessory\x20callouts,\x20color\x20swatches,\x20and\x20concise\x20English\x20annotations.\x20Clean\x20professional\x20layout.'
      }),
      'multiGridGroup': Object['freeze']({
        'title': "Multi-grid",
        'desc': 'Generate\x20continuous\x20story\x20grid\x20images\x20in\x20one\x20click'
      }),
      'multiGrid4': Object["freeze"]({
        'title': '4-grid',
        'desc': "Clear setup, turn, and payoff for a one-line story",
        'template': "Create a seamless 2x2 four-panel story grid. Story: {用户输入 || a short one-line story}. Keep the same character design, outfit, hairstyle, scene, lighting, and art style. Read left to right, top to bottom. Each panel should show a clear action beat with clean composition."
      }),
      'multiGrid9': Object["freeze"]({
        'title': "9-grid",
        'desc': "3x3 grid with finer action and emotion progression",
        'template': 'Create\x20a\x20seamless\x203x3\x20nine-panel\x20story\x20grid.\x20Story:\x20{用户输入\x20||\x20a\x20short\x20story}.\x20Keep\x20character\x20appearance,\x20costume,\x20colors,\x20scene,\x20and\x20lighting\x20consistent.\x20Each\x20panel\x20advances\x20one\x20small\x20action\x20or\x20emotion\x20beat.\x20Read\x20left\x20to\x20right,\x20top\x20to\x20bottom.'
      }),
      'multiGrid16': Object["freeze"]({
        'title': "16-grid",
        'desc': "4x4 grid with denser pacing and shot changes",
        'template': "Create a seamless 4x4 sixteen-panel story grid. Story: {用户输入 || a short story}. Maintain strict character, prop, scene, color, and style consistency. Every panel must be the next time or cause-and-effect beat, with finer action breakdowns and sensible shot changes."
      }),
      'multiGrid25': Object["freeze"]({
        'title': '25-grid',
        'desc': "5x5 long continuous story for a full sequence",
        'template': "Create a seamless 5x5 twenty-five-panel continuous story grid. Story: {用户输入 || a complete short sequence}. Keep character, outfit, scene, props, lighting, and art style consistent. No time jumps. Each panel advances the story in clear left-to-right, top-to-bottom order."
      }),
      'storyboardGroup': Object['freeze']({
        'title': 'Storyboard',
        'desc': 'Generate\x20storyboard\x20panels\x20in\x20one\x20click'
      }),
      'storyboardVertical': Object["freeze"]({
        'title': 'Vertical\x20storyboard',
        'desc': "Vertical storyboard progressing top to bottom",
        'template': "Based on {用户输入 || a short story}, create one complete vertical professional film storyboard board. Use a clean dark production-board layout with 4-6 cuts stacked top to bottom. Each cut includes a cinematic frame plus concise English notes for subject, action, description, camera, dialogue, and sound. Keep character, scene, costume, lighting, and story continuity consistent."
      }),
      'storyboardVerticalScene': Object['freeze']({
        'title': 'Vertical\x20storyboard\x20+\x20scene',
        'desc': 'Vertical\x20storyboard\x20with\x20scene\x20setting\x20references',
        'template': "Based on {用户输入 || a short story}, create one complete vertical professional film storyboard board with an additional scene reference area. Use a clean dark production-board layout with 4-6 cuts, cinematic frames, scene thumbnails, lighting and mood references, color swatches, and concise English notes for subject, action, description, camera, dialogue, and sound."
      }),
      'storyboardHorizontal': Object["freeze"]({
        'title': "Horizontal storyboard",
        'desc': "Horizontal storyboard progressing left to right",
        'template': "Based on {用户输入 || a short story}, create one complete 16:9 horizontal professional storyboard sheet. Use a structured table layout where each row is one cut. Columns include cut number, duration, frame image, scene, subject, action, description, camera, dialogue, sound, and color/lighting. Keep cinematic continuity and clean readable English notes."
      }),
      'storyboardHorizontalScene': Object['freeze']({
        'title': "Horizontal storyboard + scene",
        'desc': "Horizontal storyboard with scene setting references",
        'template': "Based on {用户输入 || a short story}, create one complete 16:9 horizontal professional storyboard sheet with a bottom reference section. Each row is one cut with a cinematic frame and concise English notes. Add scene concept, overall color palette, and style notes at the bottom. Keep character, costume, scene, lighting, and story continuity consistent."
      }),
      'filmStoryboard': Object['freeze']({
        'title': 'Film\x20storyboard',
        'desc': "Film shot storyboard template",
        'template': "Create a professional film storyboard for {用户输入 || a cinematic short scene}. Include 8 sequential panels with shot size, camera movement, action, mood, and brief dialogue or sound notes. Maintain visual continuity, cinematic lighting, and consistent characters."
      }),
      'advertisingStoryboard': Object["freeze"]({
        'title': "Advertising storyboard",
        'desc': 'Advertising\x20creative\x20storyboard\x20template',
        'template': "Create an advertising storyboard for {用户输入 || a product or brand concept}. Use 8 sequential panels: hook, problem, product reveal, key benefit, usage moment, emotional payoff, product closeup, and closing tagline. Clean commercial composition, consistent brand style."
      }),
      'gameStoryStoryboard': Object['freeze']({
        'title': 'Game\x20story\x20storyboard',
        'desc': "Game story performance storyboard template",
        'template': "Create a game cinematic storyboard for {用户输入 || a dramatic game story beat}. Use 8 sequential panels with establishing shot, character entrance, conflict reveal, action beat, reaction shot, skill or item closeup, climax, and ending frame. Keep UI-free cinematic game art style."
      }),
      'sportsTrainingStoryboard': Object["freeze"]({
        'title': 'Sports\x20training\x20storyboard',
        'desc': "Sports training action storyboard template",
        'template': "Create a sports training storyboard for {用户输入 || a training routine}. Use 8 panels showing warmup, posture setup, key movement phases, correction notes, peak action, recovery, and final result. Clear athletic motion, readable arrows, and consistent coach/athlete design."
      }),
      'animationStoryboard': Object["freeze"]({
        'title': "Animation storyboard",
        'desc': "Animation shot storyboard template",
        'template': 'Create\x20an\x20animation\x20storyboard\x20for\x20{用户输入\x20||\x20a\x20charming\x20animated\x20story}.\x20Use\x208\x20panels\x20with\x20clear\x20acting\x20poses,\x20readable\x20silhouettes,\x20emotion\x20progression,\x20simple\x20dialogue\x20bubbles,\x20and\x20consistent\x20character\x20design.\x20Bright\x20cohesive\x20color\x20and\x20professional\x20preproduction\x20layout.'
      }),
      'musicVideoStoryboard': Object["freeze"]({
        'title': "MV storyboard",
        'desc': "Music video visual storyboard template",
        'template': "Create a music video storyboard for {用户输入 || a neon rainy-night song mood}. Use 8 panels with performance shots, environment cutaways, rhythm-driven camera moves, lighting changes, dance or gesture beats, emotional closeups, and a final visual motif."
      }),
      'comicStoryboardPage': Object['freeze']({
        'title': 'Comic\x20storyboard\x20page',
        'desc': 'Comic\x20page\x20storyboard\x20template',
        'template': 'Create\x20a\x20comic\x20storyboard\x20page\x20for\x20{用户输入\x20||\x20a\x20dramatic\x20awakening\x20scene}.\x20Use\x208\x20varied\x20panels\x20with\x20manga-style\x20composition,\x20speech\x20bubbles,\x20speed\x20lines,\x20impact\x20lettering,\x20and\x20a\x20strong\x20final\x20hero\x20panel.\x20Keep\x20pacing,\x20character\x20design,\x20and\x20visual\x20energy\x20consistent.'
      }),
      'socialShortVideoStoryboard': Object["freeze"]({
        'title': "Social short-video storyboard",
        'desc': "Short-video pacing storyboard template",
        'template': 'Create\x20a\x20social\x20short-video\x20storyboard\x20for\x20{用户输入\x20||\x20a\x20quick\x20lifestyle\x20transformation}.\x20Use\x208\x20panels:\x20hook,\x20relatable\x20problem,\x20setup,\x20process\x20steps,\x20before/after\x20contrast,\x20satisfying\x20result,\x20human\x20reaction,\x20and\x20final\x20caption.\x20Bright\x20clean\x20vertical-video\x20style.'
      }),
      'brandPromotionStoryboard': Object["freeze"]({
        'title': 'Brand\x20promo\x20storyboard',
        'desc': 'Brand\x20promotion\x20visual\x20storyboard\x20template',
        'template': "Create a premium brand promotion storyboard for {用户输入 || a modern product}. Use 8 panels with lifestyle pain point, elegant product reveal, feature demonstration, emotional use moment, detail closeups, environment beauty shot, hero product frame, and tagline."
      }),
      'tutorialStoryboard': Object["freeze"]({
        'title': "Tutorial storyboard",
        'desc': 'Tutorial\x20step-by-step\x20visual\x20storyboard\x20template',
        'template': "Create a tutorial storyboard for {用户输入 || a practical step-by-step process}. Use 8 clear panels with numbered steps, arrows, concise labels, closeups of tools or actions, and a final result frame. Clean instructional layout and readable English annotations."
      }),
      'hdFilmProductionBoard': Object["freeze"]({
        'title': "HD film production board",
        'desc': "HD film production board template",
        'template': "Create a 16:9 high-definition film production board for {用户输入 || a premium vehicle performance commercial}. Include project overview, reference images, environment design, 8-shot storyboard strip, camera movement notes, color palette, lighting mood, audio tone, and post-production style."
      }),
      'xianxiaGuomanStoryboard': Object['freeze']({
        'title': 'Xianxia\x20anime\x20storyboard',
        'desc': "Xianxia anime story storyboard template",
        'template': 'Create\x20a\x2016:9\x20high-definition\x20sci-fi\x20xianxia\x20anime\x20visual\x20development\x20board\x20for\x20{用户输入\x20||\x20a\x2030-second\x20fantasy\x20action\x20sequence}.\x20Include\x20character\x20model\x20views,\x20key\x20environment\x20concept,\x20three\x20storyboard\x20sequences,\x20camera\x20movement\x20diagrams,\x20lighting\x20palette,\x20VFX\x20keywords,\x20and\x20production\x20notes.'
      }),
      'reverseImagePrompt': Object["freeze"]({
        'title': 'Reverse\x20image\x20prompt',
        'desc': "Reverse-engineer Chinese and English image prompts from a reference image",
        'template': 'You\x20are\x20a\x20professional\x20AI\x20image\x20prompt\x20reverse-engineering\x20expert.\x20Analyze\x20the\x20uploaded\x20reference\x20image\x20and\x20produce:\x201.\x20a\x20concise\x20visual\x20breakdown\x20covering\x20subject,\x20composition,\x20environment,\x20lighting,\x20color,\x20style,\x20camera\x20language,\x20and\x20image\x20quality;\x202.\x20a\x20complete\x20Chinese\x20prompt\x20suitable\x20for\x20image\x20generation;\x203.\x20a\x20natural\x20English\x20prompt\x20optimized\x20for\x20image\x20generation;\x204.\x20a\x20negative\x20prompt\x20to\x20avoid\x20low\x20quality,\x20distortion,\x20watermark,\x20bad\x20anatomy,\x20bad\x20hands,\x20and\x20unwanted\x20text.\x20Do\x20not\x20invent\x20elements\x20that\x20are\x20clearly\x20absent\x20from\x20the\x20image.'
      }),
      'longToShort': Object["freeze"]({
        'title': 'Long-to-short\x20V1',
        'desc': "Condense long-form content into a shorter version in one click",
        'template': "{用户输入}\n\nCondense the text above to about 50-70% of its original length. Preserve all direct dialogue exactly, including wording and punctuation. Remove redundant narration and excessive description, keep the plot logic clear, strengthen key emotional turns, and maintain paragraph readability. Output only the revised text."
      }),
      'extractInfo': Object["freeze"]({
        'title': 'Extract\x20characters,\x20scenes,\x20and\x20props',
        'desc': 'Extract\x20character,\x20scene,\x20and\x20prop\x20information\x20from\x20text',
        'template': "{用户输入}\n\nExtract all important characters, scenes, and props from the story above. For each character, write a detailed image-generation description including facial features, body type, hairstyle, clothing, temperament, and any state changes. Then list important props and scenes. Separate entries with --- and output only the extracted information."
      }),
      'formatShortDrama': Object["freeze"]({
        'title': "Format short-drama prompts",
        'desc': "Convert a novel into a standard AI video prompt script",
        'template': '{用户输入}\x0a\x0aConvert\x20the\x20story\x20above\x20into\x20a\x20standard\x20AI\x20short-drama\x20video\x20prompt\x20script.\x20Break\x20it\x20into\x20sequential\x20shots,\x20keep\x20the\x20original\x20plot\x20and\x20dialogue\x20faithful,\x20and\x20for\x20each\x20shot\x20write\x20the\x20scene,\x20characters,\x20action,\x20camera\x20movement,\x20emotion,\x20dialogue,\x20sound,\x20and\x20visual\x20continuity\x20notes.\x20Avoid\x20adding\x20events\x20that\x20are\x20not\x20in\x20the\x20source\x20text.'
      }),
      'storyboardScript': Object["freeze"]({
        'title': "Cinematic narrative storyboard script",
        'desc': "Convert a novel into a standard dramatic script tailored for AI short-drama video",
        'template': "{用户输入}\n\nTurn the source text into a cinematic narrative storyboard script for AI video generation. Split the story into clear shots with continuous cause-and-effect. For each shot include duration, shot size, scene, image description, character description, character action, emotion, image prompt, video prompt, dialogue, and sound. Use concrete visible actions instead of abstract emotion words. Output a clean structured script."
      }),
      'storyboardScriptTimed': Object["freeze"]({
        'title': "Cinematic narrative storyboard script - timed",
        'desc': 'Second-level\x20lighting,\x20camera\x20movement,\x20and\x20sound\x20control\x20for\x20AI\x20short-drama\x20video',
        'template': "{用户输入}\n\nCreate a second-level timed cinematic storyboard script for AI video generation. Divide the content into timed shots, each with exact seconds, lighting, camera movement, action, emotion, sound, dialogue, image prompt, and video prompt. Keep continuity strict and make every video prompt describe observable motion, body mechanics, facial expression, and camera behavior."
      }),
      'seedance2VideoFormat': Object["freeze"]({
        'title': "Seedance 2.0 video format",
        'desc': "Output Seedance 2.0 second-level video prompts using the user's duration or 15 seconds by default",
        'template': "{用户输入}\n\nFormat the content above as a Seedance 2.0 video prompt. If the user provided a duration, use it; otherwise design a 15-second video. Write time-coded segments with subject, scene, action, camera movement, lighting, style, sound, and transition notes. Keep the prompt concise, concrete, and directly usable for video generation."
      })
    })
  }),
  'webPreview': Object["freeze"]({
    'tabs': Object["freeze"]({
      'defaultTitle': 'New\x20tab',
      'loginWindow': "Login window"
    }),
    'nodeName': "Browser",
    'addressPlaceholder': "Enter a URL or search",
    'status': Object["freeze"]({
      'default': "Enter a URL or search, then press Enter to preview",
      'loading': "Loading page...",
      'loaded': "Page loaded",
      'refreshing': "Refreshing page...",
      'loadFailed': "Page failed to load",
      'blocked': 'Navigation\x20blocked',
      'nativeUnsupported': "Native browser is not supported in this environment"
    }),
    'toolbar': Object['freeze']({
      'back': "Back",
      'forward': "Forward",
      'open': "Open page",
      'refresh': "Refresh",
      'extractMedia': "Extract page media",
      'extractImages': 'Extract\x20page\x20images',
      'extractVideos': "Detect page videos",
      'saveReference': "Save web reference card",
      'openExternal': 'Open\x20in\x20browser',
      'exitFullscreen': 'Exit\x20fullscreen',
      'fullscreen': 'Fullscreen'
    }),
    'startPage': Object["freeze"]({
      'title': 'Browser'
    }),
    'shortcutEditor': Object["freeze"]({
      'namePlaceholder': 'Name',
      'urlPlaceholder': "URL",
      'cancel': "Cancel",
      'save': "Save"
    }),
    'shortcuts': Object["freeze"]({
      'add': "Add shortcut",
      'more': "More",
      'menu': Object['freeze']({
        'rename': "Rename",
        'delete': 'Delete',
        'unpin': "Unpin from page",
        'pin': 'Pin\x20to\x20page',
        'deleteHistory': 'Delete\x20history'
      })
    }),
    'toasts': Object['freeze']({
      'addressRequired': 'Enter\x20a\x20URL\x20or\x20search',
      'maxTabs': "Tab limit reached",
      'textSent': "Web text sent to canvas",
      'sourceTextSent': 'Web\x20text\x20sent\x20as\x20source\x20text',
      'imagePromptCreated': "Image node created",
      'imagePromptGenerateStarted': "Image node created. Generating...",
      'imagePromptGenerateFailed': 'Image\x20node\x20created,\x20but\x20auto\x20generation\x20failed:\x20{error}',
      'imagePromptGenerateNodeNotReady': "Image node is not ready yet",
      'videoPromptCreated': "Video node created",
      'videoPromptGenerateStarted': "Video node created. Generating...",
      'videoPromptGenerateFailed': "Video node created, but auto generation failed: {error}",
      'videoPromptGenerateNodeNotReady': "Video node is not ready yet",
      'imageAdded': "Web image added to canvas",
      'reversePromptCreated': "Reverse prompt node created",
      'reversePromptGenerateStarted': 'Reverse\x20prompt\x20node\x20created.\x20Generating...',
      'reversePromptGenerateFailed': 'Reverse\x20prompt\x20node\x20created,\x20but\x20auto\x20generation\x20failed:\x20{error}',
      'reversePromptGenerateUnavailable': "Generation command is unavailable",
      'reversePromptGenerateNodeNotReady': "Node is not ready yet",
      'openPageFirst': "Open a page first",
      'extractMediaFailed': "Failed to extract page media",
      'saveReferenceFailed': "Failed to save web reference card",
      'referenceAdded': "Web reference card added to canvas",
      'openExternalFailed': "Failed to open external link",
      'invalidShortcutUrl': "Enter a valid http/https page URL",
      'saveShortcutFailed': "Failed to save shortcut"
    }),
    'capture': Object["freeze"]({
      'fallback': Object["freeze"]({
        'image': "Web image",
        'video': "Web video",
        'reference': "Web reference"
      }),
      'nodeNames': Object["freeze"]({
        'generatedText': "Generated text",
        'sourceText': "Source text",
        'imagePrompt': "Generate image",
        'videoPrompt': "Generate video",
        'webReference': "Web reference"
      }),
      'videoSources': Object["freeze"]({
        'player': "Player",
        'pageLink': "Page link",
        'pageAttribute': 'Page\x20attribute',
        'loadedResource': "Loaded resource",
        'scriptUrl': "Script direct URL",
        'structuredData': "Page data",
        'douyinDetail': 'Douyin\x20details',
        'videoSource': "Video source"
      }),
      'videoTooltip': Object["freeze"]({
        'source': "Source: {source}",
        'url': "URL: {url}",
        'page': 'Page:\x20{url}'
      }),
      'mediaPicker': Object["freeze"]({
        'title': "Extract Page Media",
        'videoNotice': "Videos only save direct media links publicly exposed by the page. This does not parse streaming playlists or bypass login or platform restrictions. Confirm you have the right to save and use the selected videos.",
        'consent': "I confirm I have the right to save and use the selected web video assets",
        'count': "Images {imageSelected}/{imageMax} · Videos {videoSelected}/{videoMax}"
      }),
      'videoPicker': Object["freeze"]({
        'title': "Save Page Videos",
        'notice': "Only direct videos publicly exposed by the page are saved. This does not parse streaming playlists or bypass login or platform restrictions. Confirm you have the right to save and use the selected assets."
      }),
      'imagePicker': Object['freeze']({
        'title': 'Extract\x20Images'
      }),
      'buttons': Object['freeze']({
        'selectAll': "Select all",
        'clearSelection': "Clear selection",
        'cancel': "Cancel",
        'addToCanvas': "Add to canvas",
        'saveAsSourceVideo': "Save as source video node"
      }),
      'filters': Object["freeze"]({
        'all': "All",
        'image': 'Images',
        'video': 'Videos'
      }),
      'toasts': Object["freeze"]({
        'noMedia': "This page has no extractable images or public direct-link videos to save",
        'imageLimit': 'You\x20can\x20extract\x20up\x20to\x20{limit}\x20images\x20at\x20once',
        'videoLimit': "You can save up to {limit} video assets at once",
        'mediaAdded': "Added {count} web media assets",
        'noVideos': 'This\x20page\x20has\x20no\x20public\x20direct-link\x20videos\x20to\x20save',
        'videosSaved': "Saved {count} web video assets",
        'noImages': "This page has no extractable images",
        'imagesAdded': "Added {count} web images"
      })
    })
  }),
  'mediaProcessing': Object["freeze"]({
    'compose': Object['freeze']({
      'buttonLabel': "Compose",
      'video': Object["freeze"]({
        'buttonLabel': 'Compose\x20video',
        'minSelection': "Select at least 2 video clips",
        'invalidSource': "Selected video sources are invalid",
        'progress': "Composing video...",
        'missingApi': 'Backend\x20endpoint\x20is\x20missing:\x20/api/v2/video/compose.\x20Restart\x20server.py.',
        'fallback': "Composition failed",
        'resultName': 'Composed\x20video',
        'success': "Composition complete. New video node created.",
        'failedWithMessage': "Composition failed: {message}"
      }),
      'audio': Object["freeze"]({
        'buttonLabel': 'Merge\x20audio',
        'minSelection': "Select at least 2 audio clips",
        'invalidSource': 'Selected\x20audio\x20sources\x20are\x20invalid',
        'progress': 'Merging\x20audio...',
        'missingApi': "Backend endpoint is missing: /api/v2/audio/compose. Restart server.py.",
        'fallback': "Merge failed",
        'resultName': "Merged audio",
        'success': "Merge complete. New audio node created.",
        'failedWithMessage': "Merge failed: {message}"
      }),
      'audioVoice': Object["freeze"]({
        'invalidSource': "Voice Studio compose source is invalid",
        'missingTask': "Local Voice Studio compose task is unavailable",
        'videoProgress': "Composing complete video...",
        'audioProgress': "Composing complete audio...",
        'videoResultName': "Voice Studio video",
        'audioResultName': "Voice Studio audio",
        'videoSuccess': "Composition complete. New video node created.",
        'audioSuccess': "Composition complete. New audio node created.",
        'fallback': "Voice Studio composition failed",
        'failedWithMessage': "Voice Studio composition failed: {message}"
      })
    }),
    'videoAudioSeparation': Object['freeze']({
      'incompleteResult': 'Video/audio\x20separation\x20returned\x20an\x20incomplete\x20result',
      'videoFallback': 'Video',
      'videoNodeName': "Video from {name}",
      'audioNodeName': 'Audio\x20from\x20{name}',
      'unsupportedNode': "This node does not support video/audio separation",
      'busy': 'This\x20video\x20is\x20currently\x20processing.\x20Try\x20again\x20later.',
      'notLocalFile': "This video is not a processable local file",
      'progress': "Separating video and audio...",
      'success': 'Video/audio\x20separation\x20complete.\x20Video\x20and\x20audio\x20nodes\x20created.',
      'fallback': "Video/audio separation failed",
      'failedWithMessage': 'Video/audio\x20separation\x20failed:\x20{message}'
    }),
    'audioSeparation': Object['freeze']({
      'localSaveFailed': "Generated, but local save failed",
      'missingResultUrls': "Task completed, but vocal and background audio URLs were not found",
      'success': 'Vocal\x20separation\x20complete',
      'fallback': 'Vocal\x20separation\x20failed',
      'failedWithMessage': "Vocal separation failed: {message}",
      'missingTaskId': "Missing RunningHub audio task ID",
      'submitting': 'Submitting\x20RH\x20vocal\x20separation\x20task...',
      'unsupportedNode': "This node does not support vocal separation",
      'busy': "This audio is currently processing. Try again later.",
      'missingAudio': "This node has no available audio yet",
      'cancelled': "Vocal separation task cancelled",
      'nodeNames': Object["freeze"]({
        'vocalsProcessing': "Vocals (processing)",
        'backgroundProcessing': "Background (processing)",
        'vocals': "Vocals",
        'background': "Background",
        'vocalsFailed': 'Vocals\x20(failed)',
        'backgroundFailed': "Background (failed)",
        'vocalsCancelled': "Vocals (cancelled)",
        'backgroundCancelled': "Background (cancelled)"
      })
    })
  }),
  'autoUpdate': Object["freeze"]({
    'notes': Object["freeze"]({
      'empty': "No detailed notes were provided for this update.",
      'defaultSectionTitle': "Update Contents",
      'releaseFooterTitle': 'Release\x20Notes'
    }),
    'versions': Object["freeze"]({
      'newVersion': "New version",
      'currentVersion': 'Current\x20version',
      'unknownVersion': "Unknown version"
    }),
    'banner': Object['freeze']({
      'versionUpdateTitle': "Version update {version}",
      'currentVersionSuffix': " | Current version: {version}",
      'closeAria': 'Close\x20update\x20notice',
      'subtitleCurrent': "Current version {localVersion}.",
      'subtitleWithDate': "Current version {localVersion}. Published {pubDate}.",
      'subtitleNoUpdate': 'Current\x20version\x20{localVersion};\x20online\x20version\x20{remoteVersion}.'
    }),
    'buttons': Object['freeze']({
      'retrying': "Retrying...",
      'downloading': "Downloading...",
      'close': "Close",
      'cancel': "Cancel",
      'skipVersion': "Skip this version",
      'gotIt': "Got it",
      'restartInstall': "Restart and install",
      'retryDownloadInstall': "Retry download and install",
      'downloadInstall': "Download and install",
      'programUpdateUnavailable': 'In-app\x20update\x20unavailable',
      'updateNow': "Update now",
      'preparingDownload': "Preparing download...",
      'restarting': "Restarting...",
      'updating': "Updating...",
      'restartingWait': "Restarting. Please wait...",
      'later': "Later",
      'restartingInstall': "Restarting to install..."
    }),
    'progress': Object['freeze']({
      'downloading': "Downloading update {percent}",
      'retrying': "Download failed. Retry {count}..."
    }),
    'status': Object["freeze"]({
      'autoRetry': "Download hit a problem and is retrying automatically.",
      'downloadingAutoInstall': "Downloading the new version. The app will restart and install after download.",
      'downloadedRestarting': "Update downloaded. Restarting to install."
    }),
    'errors': Object["freeze"]({
      'hotApplyFailed': "Hot update failed: {error}",
      'programUpdateRequired': "This version only supports in-app updates. Try again later.",
      'unknownProgramUpdate': "Unknown error. Retry the update inside the app.",
      'networkProgramUpdate': 'Network\x20error.\x20Retry\x20the\x20update\x20inside\x20the\x20app.'
    }),
    'desktop': Object["freeze"]({
      'downloadedNotes': "The app update has been downloaded. Restart to finish installation.",
      'subtitleDownloaded': "Current version {localVersion}. New version {remoteVersion} has been downloaded and will install after restart.",
      'subtitleDownloading': 'Current\x20version\x20{localVersion}.\x20Downloading\x20new\x20version\x20{remoteVersion}.',
      'subtitleAvailable': "Current version {localVersion}. New version {remoteVersion} is available.",
      'downloadFailedMessage': "In-app update download failed. Try again later.",
      'downloadFailedWithRetries': "{message} Automatically retried {retryCount}/{maxRetries} times.",
      'downloadFailedNotes': "Updates can only be downloaded and installed inside the app. Try again later."
    }),
    'toasts': Object['freeze']({
      'programUpdateFailed': 'In-app\x20update\x20is\x20unavailable.\x20Try\x20again\x20later.',
      'downloadCancelled': "Update download cancelled.",
      'cancelDownloadFailed': "Unable to cancel the update download. Try again later.",
      'restartInstallFailed': "Restart installation failed. Try again later.",
      'previewOnly': "Update information preview: no real update will run.",
      'alreadyLatest': "You are already on the latest version",
      'installing': "Restarting to install update...",
      'updateFailed': 'App\x20update\x20failed.\x20Try\x20again\x20later.',
      'checkingDesktop': 'Checking\x20desktop\x20update...',
      'desktopCheckFailed': "Desktop update check failed. Try again later.",
      'checkingUpdate': "Checking for updates...",
      'noRemoteInfo': "No online update information was found",
      'remoteCheckFailed': "Live update check failed. Try again later.",
      'generatingPreview': "Fetching online update information...",
      'noLocalPreview': "No online update information was found",
      'localPreviewFailed': 'Failed\x20to\x20fetch\x20online\x20update\x20information.\x20Try\x20again\x20later.'
    }),
    'tutorial': Object["freeze"]({
      'defaultTitle': 'Tutorial:',
      'title': 'Tutorial',
      'versionedTitle': "Version {version} Tutorial",
      'linkLabel': "{title}:",
      'subtitle': "Choose a tutorial video to play"
    })
  }),
  'workflows': Object['freeze']({
    'manager': Object["freeze"]({
      'unknown': "Unknown",
      'title': 'Workflows',
      'detailTitle': "Workflow details",
      'sidebarAria': 'Workflow\x20panel',
      'searchPlaceholder': "Search name, tags, or notes",
      'loadFailed': "Failed to load workflows",
      'coverAlt': "Workflow cover",
      'loadToCanvas': 'Load\x20to\x20canvas',
      'deleteWorkflow': "Delete workflow",
      'rename': "Rename",
      'confirm': "Confirm",
      'cancel': 'Cancel',
      'name': "Workflow name",
      'unnamedWorkflow': "Untitled workflow",
      'noteAria': 'Workflow\x20note:\x20{note}',
      'workflowMissing': "Workflow not found",
      'content': "Contents",
      'editMeta': 'Edit\x20info',
      'updateContent': 'Update\x20content',
      'applyToCanvas': 'Apply\x20to\x20canvas',
      'applying': "Applying",
      'nodeFallback': 'Node',
      'renamed': 'Renamed',
      'renameFailed': 'Rename\x20failed',
      'deleted': 'Deleted',
      'deleteFailed': 'Delete\x20failed',
      'saving': "Saving",
      'createConfirm': 'Create',
      'currentCover': "Current cover",
      'updating': "Updating",
      'saveMeta': "Save info",
      'confirmOverwrite': "Overwrite",
      'updateConfirm': "Update",
      'note': "Note",
      'notePlaceholder': 'Use,\x20scenario,\x20or\x20steps',
      'tags': 'Tags',
      'tagLimitReached': 'Tag\x20limit\x20reached',
      'addTagPlaceholder': 'Add\x20tag',
      'addTag': "Add",
      'created': "Workflow created",
      'saveFailed': 'Failed\x20to\x20save\x20workflow',
      'metaSaved': "Workflow info saved",
      'metaSaveFailed': "Failed to save workflow info",
      'updated': 'Workflow\x20updated',
      'updateFailed': "Failed to update workflow",
      'applied': "Workflow applied to canvas",
      'applyFailed': "Failed to apply workflow",
      'meta': Object["freeze"]({
        'used': "Used {date}",
        'updated': "Updated {date}",
        'line': 'Nodes\x20{nodeCount}\x20·\x20Connections\x20{edgeCount}\x20·\x20{time}'
      }),
      'tabs': Object["freeze"]({
        'create': "Create workflow",
        'update': "Update existing workflow"
      }),
      'empty': Object['freeze']({
        'noMatches': "No matching workflows",
        'noWorkflows': "No workflows yet",
        'noNote': "No workflow note",
        'noPreviewContent': 'This\x20workflow\x20has\x20no\x20previewable\x20content\x20yet',
        'noNodePreviewContent': "This node has no previewable content",
        'noGroupNodes': "No savable nodes in the current group",
        'noCanvasNodes': 'No\x20savable\x20nodes\x20on\x20the\x20current\x20canvas',
        'noApplicableNodes': 'This\x20workflow\x20has\x20no\x20nodes\x20to\x20apply'
      }),
      'errors': Object["freeze"]({
        'nameRequired': "Name is required",
        'tagLimit': 'Add\x20up\x20to\x20{limit}\x20tags',
        'tagExists': "Tag already exists",
        'selectWorkflowToUpdate': "Select a workflow to update"
      }),
      'source': Object["freeze"]({
        'currentGroup': "Current group",
        'wholeCanvas': 'Whole\x20canvas',
        'historyWorkflow': "Existing workflow",
        'savingContent': "Content to save",
        'moreNodes': '{count}\x20more\x20nodes'
      }),
      'modal': Object["freeze"]({
        'editMetaTitle': "Edit workflow info",
        'updateTitle': "Update workflow",
        'createTitle': 'Create\x20workflow'
      }),
      'updatePicker': Object["freeze"]({
        'title': "Choose existing workflow",
        'resultCount': '{count}\x20results',
        'searchPlaceholder': "Search workflows"
      })
    }),
    'preview': Object["freeze"]({
      'nodeTypes': Object["freeze"]({
        'group': "Node group",
        'text': "Text",
        'aiText': "AI Text",
        'image': 'Image',
        'aiImage': 'AI\x20Image',
        'video': "Video",
        'aiVideo': "AI Video",
        'audio': "Audio",
        'aiAudio': "AI Audio",
        'note': "Note",
        'debug': 'Debug',
        'storyboard': "Storyboard",
        'storyboardScript': "Storyboard script",
        'scene': 'Scene',
        'panoramaScene': "3D Stage",
        'panorama360': "360 Panorama",
        'node': "Node"
      }),
      'tags': Object["freeze"]({
        'matting': 'Matting',
        'storyboard': "Storyboard",
        'scene': "Scene",
        'video': "Video",
        'audio': 'Audio',
        'image': "Image",
        'text': 'Text'
      }),
      'suggested': Object['freeze']({
        'workflowName': "{name} workflow",
        'fromTags': "{tags} workflow",
        'tagJoiner': '\x20',
        'nodeFlow': '{count}-node\x20workflow',
        'canvasWorkflow': 'Canvas\x20workflow'
      }),
      'source': Object["freeze"]({
        'currentGroup': "Current group",
        'wholeCanvas': "Whole canvas"
      }),
      'hasContent': "Contains {label} content"
    }),
    'canvas': Object['freeze']({
      'workflowNameRequired': 'Workflow\x20name\x20is\x20required',
      'missingUpdateWorkflowId': "Missing workflow ID to update"
    }),
    'service': Object["freeze"]({
      'nameRequired': "Name is required",
      'workflowMissing': "Workflow not found",
      'deleteFailed': "Delete failed"
    }),
    'selectors': Object["freeze"]({
      'unnamedWorkflow': "Untitled workflow"
    }),
    'covers': Object['freeze']({
      'titleFallback': "Workflow",
      'summary': 'Nodes\x20{nodeCount}\x20·\x20Connections\x20{edgeCount}',
      'snapshotLabel': "Workflow snapshot",
      'coverNodeLabel': "Node {index}",
      'nodeTypes': Object["freeze"]({
        'video': "Video",
        'audio': "Audio",
        'image': "Image",
        'text': 'Text',
        'mask': "Mask",
        'group': "Group",
        'node': "Node"
      })
    })
  }),
  'videoNode': Object['freeze']({
    'referenceInput': Object["freeze"]({
      'kind': Object["freeze"]({
        'text': "Text",
        'image': "Image",
        'video': "Video",
        'audio': "Audio"
      }),
      'slots': Object['freeze']({
        'sourceVideo': 'Source\x20video',
        'refImage': "Reference image",
        'firstFrame': 'First\x20frame',
        'videoMask': "Mask video",
        'maskImage': "Mask",
        'audio': "Audio"
      }),
      'removeReference': "Remove reference",
      'uploadReference': "Upload reference",
      'fullLength': "Full length",
      'sourceVideoFramesLabel': "Frames {frames} · FPS {fps} · Resolution {resolution}",
      'fixedInputs': 'Fixed\x20inputs',
      'fixedInputsAria': "{label} inputs"
    }),
    'parameterPanel': Object['freeze']({
      'generateTitle': "Generate video",
      'cancelTooltip': "Click generate again to cancel the run",
      'cancelGenerateAria': "Cancel video generation",
      'defaultPromptPlaceholder': "Describe the video. Use @ to reference assets, or / for commands...",
      'resolution': "Resolution",
      'resolutionUnavailable': "This resolution is unavailable for this model",
      'aspectRatio': 'Aspect\x20ratio',
      'adaptive': "Adaptive",
      'ratioResolutionLabel': "{aspectRatio} · {resolution}",
      'mode': Object["freeze"]({
        'allReference': "All-purpose reference",
        'firstLastFrame': "First/last frame"
      }),
      'duration': "Video duration",
      'advancedSettings': 'Advanced\x20settings',
      'debugApiParams': "Debug API parameters",
      'modelUnavailable': "Model unavailable. Select another model.",
      'vipRequired': "VIP access required. Activate your CDKEY first.",
      'videoGenerationUnavailable': "Video generation is currently unavailable",
      'smartMultiframeUnavailable': "Smart multi-frame is not available yet",
      'missingPromptOrReference': "Missing prompt or reference media. Cannot generate.",
      'debugNodeName': 'Debug\x20node',
      'debugParamsShown': "Final API parameters displayed",
      'buildRequestFailed': "Failed to build request: {error}",
      'dreaminaPrompt': Object["freeze"]({
        'frames2video': "Enter text describing the scene and motion you want. Example: a 3D boy skateboarding in a park.",
        'reference': "Upload 1-12 reference assets and enter text to combine image, text, audio, and video elements. Example: @Image1 imitates the motion from @Video1, with voice tone from @Audio1."
      }),
      'providers': Object['freeze']({
        'dreamina': "Dreamina official",
        'volcengine': 'Volcengine\x20Ark',
        'default': "Dreamina video"
      })
    })
  }),
  'canvasControls': Object['freeze']({
    'minimap': 'Show/hide\x20minimap\x20(M)',
    'grid': "Show/hide grid dots (.)",
    'connectionLines': "Show/hide connection lines (B)",
    'connectionLinesAria': 'Show\x20or\x20hide\x20connection\x20lines',
    'fit': "Fit canvas (F)",
    'pinBar': "Pin bottom-left bar",
    'autoHideBar': "Auto-hide bottom-left bar"
  }),
  'emptyHint': Object["freeze"]({
    'action': "Double-click the canvas",
    'subtitle': 'Create\x20nodes\x20freely',
    'onboarding': Object["freeze"]({
      'label': "Getting started",
      'connect': "① Connect AI · API settings →",
      'connected': '✓\x20API\x20configured',
      'create': "② Choose a template and create"
    }),
    'text': 'Text',
    'image': "Image",
    'video': "Video"
  }),
  'coreUi': Object['freeze']({
    'rendererOverlays': Object['freeze']({
      'contextMenuTitle': 'Menu',
      'delete': "Delete",
      'pickConnectBanner': "Click a target node to complete the connection"
    }),
    'fastPreviewTypes': Object['freeze']({
      'image': "Image",
      'video': "Video",
      'audio': "Audio",
      'text': "Text",
      'node': "Node"
    }),
    'generationTask': Object['freeze']({
      'cancelled': "Task cancelled",
      'generateFailed': "Generation failed",
      'queued': "Queued",
      'resumeFailed': 'Resume\x20failed'
    }),
    'renderer': Object["freeze"]({
      'dreaminaPhase': Object["freeze"]({
        'failed': "Query failed",
        'syncing': 'Syncing\x20result',
        'queued': 'Queued',
        'generating': "Generating",
        'done': "Completed"
      }),
      'videoMeta': Object["freeze"]({
        'framesFps': "{frames} frames · {fps}fps"
      }),
      'defaultNodeNames': Object["freeze"]({
        'node': "Node",
        'image': "Image",
        'video': "Video",
        'audio': "Audio",
        'text': "Text"
      }),
      'picker': Object["freeze"]({
        'addNode': "Add node",
        'items': Object["freeze"]({
          'aiText': '✨\x20\x20Generate\x20text',
          'aiImage': '✨\x20\x20Generate\x20image',
          'aiVideo': "✨  Generate video",
          'aiAudio': "✨  Generate audio"
        }),
        'defaults': Object['freeze']({
          'aiText': 'Generated\x20text',
          'aiImage': "Generated image",
          'aiVideo': "Generated video",
          'aiAudio': 'Generated\x20audio'
        })
      }),
      'multiSelect': Object["freeze"]({
        'syncVideoPlay': "Sync video playback",
        'syncVideoPlayHint': "Sync video playback (G; Shift+click or Shift+G to loop)",
        'syncVideoPause': "Pause synchronized videos",
        'runSelected': 'Run\x20selected\x20nodes',
        'createAsset': "Create asset",
        'batchDownload': "Batch download",
        'group': "Group",
        'resetDefaultSize': "Reset default size",
        'composeVideo': 'Compose\x20video',
        'createCollage': 'Create\x20collage',
        'materialComparison': "Compare materials"
      }),
      'align': Object["freeze"]({
        'left': 'Align\x20left',
        'hCenter': "Align horizontal center",
        'right': 'Align\x20right',
        'top': 'Align\x20top',
        'bottom': "Align bottom",
        'distributeH': "Distribute horizontally",
        'vCenter': "Align vertical center",
        'distributeV': "Distribute vertically",
        'arrangeGrid': "Arrange in grid",
        'arrangeGridHint': "Arrange in grid (right-click or ↓ for columns)",
        'gridMenu': 'Choose\x20grid\x20columns',
        'gridAuto': "Automatic columns",
        'gridColumns': "{count} columns"
      })
    })
  }),
  'nodeBatchExport': Object["freeze"]({
    'toasts': Object['freeze']({
      'started': "Batch download started...",
      'completed': "Batch download complete: exported {count}",
      'completedWithSkipped': "Exported {exported}, skipped {skipped}",
      'noExportable': "The selected nodes do not have downloadable content",
      'unsupported': "Batch download is not supported in this environment",
      'failed': "Batch download failed",
      'failedWithMessage': "Batch download failed: {message}"
    })
  }),
  'coreServices': Object["freeze"]({
    'completion': Object["freeze"]({
      'notificationBody': "Generation task completed.",
      'notificationNodeBody': "“{name}” finished generating.",
      'soundPlaybackFailed': "Completion sound playback failed. Check the file."
    }),
    'projectFile': Object["freeze"]({
      'unnamedCanvas': "Untitled canvas"
    }),
    'externalLink': Object['freeze']({
      'externalLink': "External link",
      'link': "link",
      'blocked': 'This\x20external\x20link\x20is\x20not\x20allowed',
      'missing': "No {label} detected",
      'openFailed': 'Unable\x20to\x20open\x20external\x20link'
    }),
    'diagnostics': Object["freeze"]({
      'packageUnsupported': "This environment does not support creating diagnostics packages",
      'logsUnsupported': "This environment does not support opening the logs folder"
    })
  }),
  'canvasInteraction': Object['freeze']({
    'grids': Object["freeze"]({
      'grid4': "4-grid",
      'grid9': "9-grid",
      'grid16': '16-grid',
      'grid25': '25-grid',
      'createGrid': "Create grid storyboard",
      'collageName': "Collage",
      'noImages': "No image nodes in the selection for collage",
      'boundsFailed': "Unable to calculate collage bounds",
      'created': "Collage node created"
    }),
    'contextMenu': Object["freeze"]({
      'copyNode': 'Copy\x20node',
      'cutNode': "Cut node",
      'paste': 'Paste',
      'materialComparison': "Compare materials",
      'createCollage': 'Create\x20collage',
      'copyImage': 'Copy\x20image',
      'addAsset': "Add to material library",
      'revealAsset': "Open material folder",
      'openOutputFolder': 'Open\x20output\x20folder',
      'duplicate': "Duplicate",
      'copyText': 'Copy\x20text',
      'pasteText': "Paste text",
      'deleteNode': "Delete node",
      'addResource': "Add resource",
      'addNode': 'Add\x20node',
      'undo': 'Undo',
      'redo': "Redo"
    }),
    'toasts': Object["freeze"]({
      'nodeCopied': "Node copied",
      'nodeCut': "Node cut",
      'assetPanelFailed': 'Unable\x20to\x20open\x20asset\x20panel',
      'assetRevealFailed': "Unable to locate this asset",
      'outputFolderFailed': "Unable to open output folder",
      'duplicateWithEdgesCreated': 'Duplicate\x20with\x20connections\x20created',
      'textCopied': "Text copied to clipboard",
      'selectedTextCopied': "Selected text copied",
      'copyFailed': "Copy failed. Check browser clipboard permission.",
      'noNodeText': "This node has no text",
      'unsupportedUpload': "Only image, video, or audio files can be uploaded",
      'materialComparisonFailed': "Unable to open material comparison"
    }),
    'generation': Object["freeze"]({
      'text': "Generate text",
      'image': 'Generate\x20image',
      'video': "Generate video",
      'audio': 'Generate\x20audio'
    }),
    'materialComparison': Object["freeze"]({
      'title': "Material comparison",
      'ariaLabel': "Material comparison viewer",
      'localCache': "Comparison library uses the local cache",
      'modeGroupLabel': 'Comparison\x20mode',
      'slideMode': "Slider",
      'sideBySideMode': 'Side\x20by\x20side',
      'dividerLabel': "Drag to adjust the material divider",
      'close': "Close",
      'library': "Comparison library",
      'libraryHint': 'Assign\x20left,\x20then\x20right;\x20the\x20right\x20material\x20must\x20match\x20the\x20left\x20type',
      'left': "Left",
      'right': "Right",
      'untitled': 'Material\x20{index}',
      'thumbnailLabel': "Material {index}: {name}",
      'playbackLabel': 'Comparison\x20videos',
      'playVideos': "Play comparison videos together",
      'pauseVideos': 'Pause\x20comparison\x20videos',
      'playbackProgress': "Comparison video playback progress",
      'volume': "Comparison video volume",
      'toggleMute': 'Toggle\x20comparison\x20video\x20mute',
      'enableLoop': "Enable loop playback",
      'disableLoop': "Disable loop playback",
      'mutePanelVideo': "Mute the {side} video",
      'unmutePanelVideo': 'Unmute\x20the\x20{side}\x20video'
    }),
    'generationNames': Object['freeze']({
      'text': 'Generated\x20text',
      'image': "Generated image",
      'video': "Generated video",
      'audio': "Generated audio"
    }),
    'group': Object["freeze"]({
      'newGroup': "New group"
    }),
    'uploadTypeNames': Object["freeze"]({
      'image': "Image",
      'video': "Video",
      'audio': 'Audio'
    })
  }),
  'edgeController': Object['freeze']({
    'addConnection': "Add connection",
    'quoteMenuTitle': "Reference this node",
    'inputMenuTitle': "Create input node"
  }),
  'fileService': Object['freeze']({
    'unknownError': 'Unknown\x20error',
    'defaultNames': Object['freeze']({
      'image': "Image",
      'video': "Video",
      'audio': "Audio",
      'mediaClip': "Clip",
      'text': 'Text',
      'file': "File",
      'webImage': "Web image",
      'webVideo': "Web video",
      'unknownFile': "unknown file"
    }),
    'errors': Object['freeze']({
      'remoteImageImportFailed': "Remote image import failed",
      'remoteVideoImportFailed': "Remote video import failed",
      'remoteImportUnsupported': 'This\x20environment\x20does\x20not\x20support\x20remote\x20asset\x20import',
      'webVideoRightsRequired': 'Confirm\x20you\x20have\x20permission\x20to\x20save\x20and\x20use\x20this\x20web\x20video\x20asset\x20first',
      'unsupportedFileType': "This file type is not supported yet: {file}",
      'videoTooLarge': "Video files cannot exceed {maxMB} MB: {file}",
      'importFailed': 'Import\x20failed',
      'importFailedWithFile': "Import failed: {file}. {reason}",
      'importFailedReason': 'Reason:\x20{reason}',
      'jsonParseFailed': "JSON parsing failed",
      'fileReadFailed': "File read failed"
    })
  }),
  'projectLifecycle': Object["freeze"]({
    'untitledProject': 'Untitled\x20project',
    'untitledCanvas': "Untitled canvas",
    'defaultCanvas': "Default canvas",
    'loadingWorkspaceFiles': "Loading workspace files...",
    'projectPersistenceLoading': "Canvas projects are loading safely. Please wait before saving.",
    'projectPersistenceLoadFailed': "Canvas projects failed to load. Saving is paused to prevent overwriting existing data.",
    'historicalAiLocalizationStarted': "Detected {count} historical generation results that are not local. Repairing...",
    'historicalAiLocalizationFixed': "Repaired {count} generation results (saved to output)",
    'historicalImageDerivativesFixed': "Filled display/thumb for {count} image nodes",
    'packageUnsupported': "Project package loading is not supported in this environment",
    'packagePathMissing': "Unable to read project package path",
    'localArchiveLoaded': "Loaded local archive: {name}",
    'jsonArchiveParseFailed': "Failed to parse JSON archive"
  }),
  'imageFunctionMenu': Object["freeze"]({
    'providers': Object["freeze"]({
      'grsai': Object['freeze']({
        'description': "High-performance AI image generation service"
      }),
      'apimart': Object["freeze"]({
        'description': "One API for everything, saving 30-70%"
      }),
      'runninghub': Object["freeze"]({
        'name': "RunningHUB Models",
        'description': "Model API: text-to-image, image-to-image, image editing"
      }),
      'runninghubWorkflow': Object["freeze"]({
        'name': "RunningHUB Workflows",
        'description': "Dedicated workflow for camera angle control"
      })
    }),
    'modes': Object["freeze"]({
      'normal': "Normal",
      'fast': 'Fast',
      'lowPrice': "Low-price",
      'official': "Official",
      'lowPriceRoute': "Low-price route",
      'lowPriceRoute2': "Low-price route 2",
      'highValueRoute': 'High-value\x20route',
      'officialDirectRoute': "Official direct route"
    }),
    'families': Object['freeze']({
      'base': 'Base\x20model',
      'pro': "Professional enhanced model",
      'secondGen': "Second-generation model"
    })
  }),
  'imageModelConfig': Object["freeze"]({
    'providers': Object['freeze']({
      'grsai': Object["freeze"]({
        'description': "High-performance AI image generation service"
      }),
      'ppio': Object["freeze"]({
        'name': "PPIO",
        'description': 'Cost-effective,\x20elastic,\x20low-latency\x20products'
      }),
      'apimart': Object["freeze"]({
        'description': "One API for everything, saving 30-70%"
      }),
      'runninghub': Object["freeze"]({
        'description': 'AI\x20workflow\x20and\x20model\x20API\x20aggregation\x20platform'
      }),
      'aicanvas': Object["freeze"]({
        'description': 'Canvas\x20AI\x20developer-mode\x20placeholder\x20provider',
        'placeholderImageModel': "Developer-mode placeholder image model"
      })
    })
  }),
  'aigenText': Object["freeze"]({
    'previewPlaceholder': "Enter a prompt to start creating",
    'promptPlaceholder': 'Enter\x20a\x20prompt\x20to\x20start\x20creating\x20\x20\x20(Enter\x20to\x20generate,\x20Shift+Enter\x20for\x20a\x20new\x20line)',
    'customModelTitle': "Custom model",
    'customModelSubtitle': "OpenAI-compatible text/vision endpoint",
    'debugApiParams': "Debug API parameters",
    'generate': "Generate",
    'customModel': Object["freeze"]({
      'addModel': 'Add\x20model',
      'namePlaceholder': 'Enter\x20model\x20name',
      'confirm': 'Confirm'
    }),
    'refs': Object['freeze']({
      'maskBadge': "Mask",
      'remove': "Remove",
      'removeReference': "Remove reference",
      'groupShortName': "Group",
      'nodeShortName': "Node",
      'types': Object["freeze"]({
        'text': 'Text',
        'image': "Image",
        'video': 'Video',
        'audio': 'Audio',
        'group': "Group",
        'other': "Node"
      })
    }),
    'debug': Object["freeze"]({
      'nodeName': "Debug node",
      'paramsShown': "Final API request displayed (not sent)",
      'buildRequestFailed': "Failed to build request: {error}"
    }),
    'task': Object["freeze"]({
      'promptRequired': "Enter a prompt before generating",
      'imageReferenceRequired': "This model requires an image reference",
      'generationFailed': "Text generation failed",
      'generationFailedWithError': 'Text\x20generation\x20failed:\x20{error}'
    }),
    'result': Object['freeze']({
      'timeoutTitle': 'Generation\x20timed\x20out',
      'sources': "Sources",
      'images': "Image results",
      'imagePreview': 'Preview\x20image',
      'imageSource': "View source",
      'imageOriginal': "Open original image link",
      'imageAdd': 'Add\x20to\x20canvas',
      'imageAdding': "Saving image…",
      'imageAdded': "Added to canvas",
      'imageRetry': "Retry adding to canvas",
      'imageLoadFailed': "Preview unavailable. Open the source or try adding to canvas.",
      'imageImportFailed': "Could not save the image. Retry or open the source.",
      'imageUnavailable': 'The\x20image\x20or\x20original\x20text\x20node\x20no\x20longer\x20exists',
      'imageCanvasChanged': "Canvas changed. Image saved to the asset library without adding to this canvas.",
      'imagesEmpty': "The model returned no displayable image links. Try adjusting your description.",
      'imageToolUsage': "Image tools: {text} text searches, {image} reverse image searches",
      'toolUsage': "Web tools: {search} searches, {read} page reads",
      'toolUsageUnavailable': "The model returned no web tool usage record. Check the provided sources.",
      'timeoutReason': 'The\x20API\x20did\x20not\x20return\x20a\x20result\x20within\x20the\x20timeout\x20window.\x20The\x20provider\x20may\x20be\x20busy,\x20or\x20the\x20upstream\x20model\x20may\x20be\x20responding\x20slowly.',
      'timeoutRetry': 'Try\x20again\x20later,\x20or\x20switch\x20to\x20another\x20available\x20model.',
      'errorDetail': "Error details: {detail}"
    })
  }),
  'aigenImage': Object['freeze']({
    'prompt': Object["freeze"]({
      'placeholder': "Describe anything you want to generate, use @ to reference assets, or type / for commands   (Enter to generate, Shift+Enter for a new line)"
    }),
    'refs': Object["freeze"]({
      'maskBadge': "Mask",
      'referenceImage': "Reference image",
      'replaceTarget': "Target",
      'replacedImage': "Replacement image",
      'uploadReference': "Upload reference",
      'removeReference': "Remove reference",
      'types': Object["freeze"]({
        'text': 'Text',
        'image': "Image",
        'video': 'Video',
        'audio': "Audio"
      })
    }),
    'uiSchema': Object["freeze"]({
      'fullLength': "Full length",
      'numericValueAria': "{label} value",
      'random': "Random",
      'fixed': 'Fixed',
      'randomAria': "{label} random",
      'singleControl': "Single control",
      'controlColon': ':',
      'efficiency': "Efficiency",
      'stable': "Stable",
      'multiControl': "Multi-person control",
      'yes': "Yes",
      'no': 'No',
      'maskExpandValue': "Mask expansion value",
      'assetInput': Object['freeze']({
        'image': "Image",
        'video': "Video",
        'audio': "Audio"
      })
    }),
    'controls': Object["freeze"]({
      'advancedSettings': "Advanced",
      'debugApiParams': 'Debug\x20API\x20parameters',
      'generate': "Generate",
      'cancelGenerate': "Cancel generation",
      'cancelTaskTooltip': "Click to cancel task"
    }),
    'debug': Object["freeze"]({
      'missingPayload': "Missing prompt or referenced media. Cannot generate.",
      'nodeName': "Debug node",
      'paramsShown': "Final API parameters displayed",
      'buildRequestFailed': "Failed to build request: {error}"
    }),
    'access': Object["freeze"]({
      'vipRequired': "VIP access required. Activate a CDKEY first."
    }),
    'upload': Object["freeze"]({
      'missingUrl': "Upload failed: no file URL returned",
      'failedRetry': "Upload failed. Try again."
    }),
    'result': Object["freeze"]({
      'generationFailed': "Generation failed",
      'imageFallbackName': 'Image',
      'dragUnavailable': "This result image has no local image available to drag out",
      'imageCount': '{count}\x20images',
      'restrictedOrFailed': "Restricted/failed"
    }),
    'task': Object["freeze"]({
      'apiKeyMissing': Object['freeze']({
        'volcengine': "Set Volcengine Ark API Key in Settings first",
        'runninghubModel': 'Set\x20RunningHub\x20Model\x20API\x20Key\x20in\x20Settings\x20first',
        'runninghub': "Set RunningHub API Key in Settings first",
        'apimart': "Set APIMart API Key in Settings first",
        'ppio': "Set PPIO API Key in Settings first",
        'grsai': "Set GRSAI API Key in Settings first"
      }),
      'dreaminaLoginRequired': "Dreamina CLI is not signed in. Click Open settings to finish signing in.",
      'dreaminaLoginStatusUnavailable': 'Unable\x20to\x20verify\x20the\x20Dreamina\x20CLI\x20sign-in\x20status.\x20Click\x20Open\x20settings\x20to\x20check\x20it.',
      'openSettings': "Open settings",
      'checkingDreaminaLogin': "Checking Dreamina sign-in status",
      'generating': "Generating",
      'submitting': "Submitting",
      'completed': "Completed",
      'generationFailed': "Generation failed",
      'imageGenerationFailed': "Image generation failed",
      'interrupted': "Generation interrupted",
      'interruptedMissingTaskId': 'Generation\x20interrupted:\x20task\x20ID\x20was\x20not\x20returned\x20yet',
      'cancelMissingApiKey': "Cancel failed: missing API Key",
      'cancelFailed': 'Cancel\x20failed',
      'cancelSuccess': "Cancelled",
      'taskNotFound': "Task not found",
      'cancelledToast': "Task cancelled",
      'referenceImageRequired': 'Add\x20at\x20least\x20one\x20reference\x20image\x20before\x20generating',
      'replacePairRequired': "Add two images first: target and replacement image",
      'promptOrReferenceRequired': "Enter a prompt or add reference media"
    }),
    'qwen': Object["freeze"]({
      'versionTooltips': Object["freeze"]({
        'qwen2509': "2509: improved multi-image editing and single-image consistency. Good for characters, products, text editing, and ControlNet inputs such as depth, edge, keypoint, or pose maps.",
        'qwen2511': '2511:\x20newer\x20instruction\x20image\x20editing\x20with\x20stronger\x20character\x20and\x20multi-person\x20consistency,\x20materials,\x20lighting,\x20industrial\x20design,\x20and\x20text\x20editing.\x20Supports\x201-3\x20reference\x20images\x20and\x20multi-turn\x20edits.'
      }),
      'firstImageModes': Object["freeze"]({
        'original': 'Original',
        'pose': "Pose map",
        'depth': "Depth map"
      })
    }),
    'modelMenu': Object['freeze']({
      'unavailable': "{model} is currently unavailable",
      'qwenEdit': Object['freeze']({
        'title': "Qwen image edit",
        'description': "Multi-image instruction editing for character/product consistency, text edits, and pose/depth control"
      }),
      'animeReal': Object["freeze"]({
        'title': "Anime to realistic V2",
        'description': "Workflow-based conversion from anime character to realistic portrait"
      }),
      'personReplaceV21': Object["freeze"]({
        'title': 'Person\x20replacement\x20V2.1',
        'description': "Two-image person replacement with target/replacement masks"
      }),
      'personReplaceV3': Object['freeze']({
        'title': 'Person\x20replacement\x20image\x20edit\x20V3',
        'description': "Keep composition and lighting while replacing people, clothing, or objects"
      })
    }),
    'dreamina': Object["freeze"]({
      'alt': "Dreamina",
      'label': 'Dreamina\x20Official\x20(Advanced\x20membership\x20required)',
      'subtitle': 'Choose\x20by\x20version;\x20text-to-image/image-to-image\x20is\x20automatic'
    })
  }),
  'sharedPromptPanel': Object["freeze"]({
    'promptPlaceholder': "Enter a prompt...",
    'customModelTitle': "Custom model",
    'customModelSubtitle': "OpenAI-compatible text endpoint",
    'addModel': "Add model",
    'modelNamePlaceholder': 'Enter\x20model\x20name',
    'confirm': 'Confirm',
    'debugApiParams': "Debug API parameters",
    'debugNodeName': 'Debug\x20node',
    'debugParamsShown': "Final API parameters displayed",
    'buildRequestFailed': "Failed to build request: {error}",
    'generate': "Generate"
  }),
  'nodePromptShared': Object["freeze"]({
    'autoMentionMissing': "No available asset found; choose one from the @ menu",
    'autoMentionAmbiguous': 'Multiple\x20assets\x20share\x20this\x20name;\x20choose\x20one\x20from\x20the\x20@\x20menu',
    'autoMentionIssues': "Some references were kept as text: {details}",
    'materialFallback': "Asset",
    'assetFallback': "Asset",
    'assetUnavailable': "This asset has no media usable by the current model",
    'useEntireAsset': "Use entire asset",
    'assetTypes': Object["freeze"]({
      'text': 'Text',
      'image': "Image",
      'video': "Video",
      'audio': "Audio"
    })
  }),
  'groupNode': Object["freeze"]({
    'defaultName': "New group",
    'renameTooltip': "Click to rename",
    'toolbar': Object["freeze"]({
      'runGroup': "Run group",
      'stopGroup': 'Stop\x20group\x20generation',
      'syncPlay': 'Play\x20videos\x20together',
      'color': "Color",
      'createWorkflow': "Create workflow",
      'ungroup': "Ungroup"
    })
  }),
  'mediaClip': Object["freeze"]({
    'menu': Object['freeze']({
      'addToCanvas': "Add to canvas",
      'export': "Export"
    }),
    'tools': Object['freeze']({
      'splitMaterial': "Split material (C)",
      'export': "Export"
    }),
    'pick': Object["freeze"]({
      'addByConnection': "Add clips by connection",
      'continueAdd': "Add another clip"
    }),
    'empty': Object["freeze"]({
      'selectMaterial': 'Choose\x20a\x20clip\x20to\x20add',
      'connectHint': "Click the connection button, then pick a video, image, or audio on the canvas",
      'exit': 'Esc\x20exits'
    }),
    'audioLane': Object["freeze"]({
      'mute': "Mute audio lane",
      'unmute': "Unmute audio lane"
    }),
    'outputNames': Object['freeze']({
      'image': "Clipped image",
      'audio': "Clipped audio",
      'video': "Clipped video"
    }),
    'export': Object["freeze"]({
      'loading': "Exporting material",
      'noMaterial': 'No\x20material\x20to\x20export',
      'materialAdded': "Material exported to canvas",
      'materialFailed': "Failed to export material",
      'noClips': "No clips to export",
      'clipExported': "Clip exported",
      'clipFailed': 'Failed\x20to\x20export\x20clip'
    }),
    'playback': Object['freeze']({
      'previewUnavailable': "This material cannot be previewed",
      'play': 'Play',
      'pause': 'Pause'
    }),
    'toasts': Object["freeze"]({
      'splitAtMiddle': "Move the playhead inside the material before splitting"
    }),
    'hints': Object['freeze']({
      'playPause': "Play/Pause",
      'splitAtPlayhead': "Split material at playhead",
      'deleteCurrent': "Delete current material",
      'dragMaterial': "Drag material",
      'adjustOrder': "Reorder",
      'dragEdges': 'Drag\x20edges',
      'trimMaterial': "Trim material",
      'rightClick': "Right-click",
      'exportOrDelete': "Export or delete material",
      'connectButtonAdd': "Connection button adds clips",
      'zoomTimeline': "+ wheel to zoom timeline"
    }),
    'materialMenu': Object["freeze"]({
      'exportToCanvas': 'Export\x20material\x20to\x20canvas',
      'enable': "Enable material",
      'disable': 'Disable\x20material',
      'delete': 'Delete\x20material'
    }),
    'preview': Object["freeze"]({
      'collapse': "Collapse",
      'audioClip': "Audio clip"
    }),
    'trim': Object["freeze"]({
      'left': 'Left\x20trim',
      'right': "Right trim"
    })
  }),
  'sourceImageNode': Object["freeze"]({
    'upload': Object["freeze"]({
      'button': "Upload",
      'transcoding': "Transcoding...",
      'uploading': 'Uploading...',
      'canvasTranscodeFailed': "Canvas transcode failed",
      'imageLoadFailed': 'Image\x20failed\x20to\x20load',
      'failedRetry': "Upload failed. Try again."
    }),
    'toasts': Object["freeze"]({
      'generateUnsupported': 'Source\x20image\x20nodes\x20do\x20not\x20support\x20generation'
    }),
    'recovery': Object['freeze']({
      'taskFailed': "Task recovery failed",
      'failed': 'Recovery\x20failed',
      'failedWithMessage': "Recovery failed: {message}",
      'imageTaskFailed': "Image task recovery failed",
      'dreaminaImageTaskFailed': "Dreamina image task recovery failed",
      'asyncImageTaskFailed': 'Async\x20image\x20task\x20recovery\x20failed',
      'noOutputImage': "No usable output image was returned"
    }),
    'result': Object["freeze"]({
      'defaultName': "Image result"
    }),
    'status': Object['freeze']({
      'generating': "Generating",
      'completed': "Completed",
      'queuedBackground': "Queued (background check)",
      'cancelled': "Cancelled",
      'generationFailed': "Generation failed"
    })
  }),
  'sourceVideoNode': Object["freeze"]({
    'upload': Object["freeze"]({
      'button': "Upload",
      'uploading': "Uploading...",
      'failedRetry': "Upload failed. Try again."
    }),
    'controls': Object["freeze"]({
      'playLoopHint': "Play (Shift+click to loop)",
      'pause': "Pause",
      'toggleMute': "Toggle mute",
      'captureFrame': "Capture current frame"
    }),
    'recovery': Object["freeze"]({
      'taskFailed': 'Task\x20recovery\x20failed',
      'failedWithMessage': "Recovery failed: {message}",
      'noOutputVideoUrl': "No usable output video URL was returned",
      'runninghubApiKeyMissing': "RunningHUB API Key is not configured"
    }),
    'result': Object["freeze"]({
      'defaultName': "Video result",
      'hdVideo': "HD video"
    })
  }),
  'sourceTextNode': Object["freeze"]({
    'placeholder': Object["freeze"]({
      'initial': "Enter a prompt to start creating",
      'edit': "Double-click to enter text input mode"
    }),
    'charCount': "{count} chars"
  }),
  'sourceAudioNode': Object["freeze"]({
    'upload': Object["freeze"]({
      'button': "Upload",
      'uploading': "Uploading...",
      'failedRetry': "Upload failed. Try again."
    }),
    'toolbar': Object["freeze"]({
      'cancelAudioSeparation': "Cancel vocal separation"
    }),
    'download': Object["freeze"]({
      'missingAudio': "No audio to download"
    })
  }),
  'generationNodeHelpTip': Object["freeze"]({
    'ariaLabel': "Generation model help",
    'advancedVoiceClone': Object['freeze']({
      'title': "Advanced Voice Clone Guide",
      'duration': "Supports [[red:3-15s audio]]",
      'noAudio': "With [[red:no audio input]], TTS generates a random voice from the prompt.",
      'promptExample': "Example: The moonlight is beautiful tonight.",
      'oneAudio': "With [[red:1 audio input]], clone that voice.",
      'twoAudio': "With [[red:2 audio inputs]], create multi-speaker cloned dialogue.",
      'examples': "Examples:",
      'audio1': "@Audio 1",
      'audio2': "@Audio 2",
      'exampleSpeaker1': "Are you coming home tonight?",
      'exampleSpeaker2': 'No,\x20I\x20have\x20to\x20work\x20late.'
    })
  }),
  'audioModelMenu': Object['freeze']({
    'runninghub': Object['freeze']({
      'label': "RunningHUB Workflows",
      'subtitle': 'Audio\x20generation\x20workflows'
    })
  }),
  'previewGenerateButton': Object["freeze"]({
    'generate': "Generate",
    'clickCancelTask': "Click to cancel task",
    'cancelGenerate': "Cancel generation"
  }),
  'videoFrameExtraction': Object['freeze']({
    'videoNotLoaded': "The current video has not finished loading",
    'captureUnsupported': 'Frame\x20capture\x20is\x20not\x20supported\x20for\x20this\x20video\x20source',
    'capturedFrameName': "Captured frame {frameIndex}",
    'capturedFrameNameWithSource': "{sourceName}.{frameIndex}f",
    'localSaveFailed': "Local save failed",
    'shownButSaveFailed': "The frame is shown, but local save failed"
  }),
  'videoSyncPlayback': Object["freeze"]({
    'fewerThanTwo': "Fewer than 2 videos can be synced",
    'selectedUnmounted': "The selected video is not mounted, so sync playback cannot start",
    'playedCount': "Synced playback for {count} videos",
    'none': "No videos can be synced"
  }),
  'videoResultRender': Object["freeze"]({
    'generationFailed': "Generation failed",
    'elapsedMinutesSeconds': '{minutes}m\x20{seconds}s',
    'elapsedSeconds': '{seconds}s'
  }),
  'audioGenerationResult': Object["freeze"]({
    'localSaveFailed': "Generated, but local save failed",
    'missingLocalAudioPath': "Invalid audio result: missing local audio path"
  }),
  'videoGenerationResult': Object["freeze"]({
    'failed': "Generation failed"
  }),
  'runningHubVideoSubmit': Object["freeze"]({
    'visualInputRequired': "Connect a video or reference image input",
    'audioInputRequired': "Connect an audio input",
    'referenceImageFramesRequired': 'Set\x20the\x20reference\x20image\x20input\x20frame\x20count\x20above\x200',
    'videoDurationMissing': "Cannot read video duration. Wait for video info to load, then generate again.",
    'audioDurationMissing': "Cannot read audio duration. Wait for audio to load, then generate again.",
    'videoLongerThanAudio': "Generated video duration cannot exceed audio duration"
  }),
  'dreaminaVideo': Object["freeze"]({
    'route': Object["freeze"]({
      'multimodal2video': 'All-purpose\x20reference',
      'frames2video': "First/last frames",
      'multiframe2video': "Smart multiframe"
    }),
    'task': Object["freeze"]({
      'video': 'Dreamina\x20video',
      'text2video': "Text to video",
      'image2video': "First frame to video",
      'frames2video': "First/last frames",
      'multiframe2video': "Smart multiframe",
      'multimodal2video': "All-purpose reference"
    }),
    'validation': Object["freeze"]({
      'framesOnlyImages': "First/last frame mode only supports image references",
      'imageAtLeastOne': "First/last frame mode needs at least 1 image",
      'imageAtMostOneSingle': 'First/last\x20frame\x20mode\x20supports\x20only\x201\x20image\x20for\x20the\x20single-image\x20path',
      'framesNeedTwo': "First/last frame mode needs 2 images",
      'framesAtMostTwo': "First/last frame mode supports at most 2 images",
      'allReferenceNeedsVisual': "All-purpose reference needs at least 1 image or 1 video; audio cannot be used alone",
      'allReferenceMaxImages': "All-purpose reference supports at most {max} images",
      'allReferenceMaxVideos': "All-purpose reference supports at most {max} videos",
      'allReferenceMaxAudios': "All-purpose reference supports at most {max} audio clips",
      'multiframeOnlyImages': "Smart multiframe supports image references only",
      'multiframeAtLeastTwo': "Smart multiframe needs at least 2 images",
      'multiframeMaxImages': "Smart multiframe supports at most 20 images"
    })
  }),
  'modelInputPolicy': Object['freeze']({
    'unsupported': "This model does not support this material type",
    'limitReached': "This model supports only {max} {type} input(s). Remove an existing @ reference first.",
    'required': "This model requires at least {min} {type} input(s)",
    'inputKinds': Object["freeze"]({
      'text': "text",
      'image': "image",
      'video': "video",
      'audio': "audio",
      'material': "material"
    })
  }),
  'aigenAudioNode': Object['freeze']({
    'validation': Object["freeze"]({
      'promptRequired': "Enter a prompt",
      'referenceVoiceRequired': "Connect a reference voice",
      'voiceConvertRefsRequired': "Voice conversion requires a voice-line reference and a prosody reference",
      'advancedVoiceDuration': "{label} is about {duration}s. Advanced voice cloning supports 3-15s audio only."
    }),
    'refs': Object["freeze"]({
      'referenceVoice': "Reference voice",
      'audio1': "Audio 1",
      'audio2': "Audio 2",
      'inputAria': "Audio inputs",
      'connectAudio': "Connect audio",
      'remove': "Remove"
    }),
    'help': Object["freeze"]({
      'ariaLabel': "Generation node help"
    }),
    'errors': Object["freeze"]({
      'localSaveGeneratedFailed': "Generated, but local save failed"
    }),
    'buttons': Object["freeze"]({
      'generate': "Generate",
      'generateCancellable': "Click to generate. Click again to cancel.",
      'cancelAudioGeneration': "Cancel audio generation"
    }),
    'controls': Object['freeze']({
      'advancedSettings': "Advanced settings"
    }),
    'vip': Object["freeze"]({
      'needAuthorization': "VIP authorization required. Activate your CDKEY first.",
      'needSubscription': 'This\x20model\x20requires\x20VIP.\x20Activate\x20CDKEY/subscription\x20first.'
    }),
    'cancel': Object["freeze"]({
      'interruptedMissingTaskId': "Generation interrupted: task ID was not returned",
      'failed': "Cancel failed",
      'success': "Cancelled",
      'taskMissing': 'Task\x20not\x20found',
      'missingApiKey': "Cancel failed: missing API Key"
    }),
    'generation': Object['freeze']({
      'failed': "Audio generation failed",
      'interrupted': 'Generation\x20interrupted',
      'completed': "Audio generation completed",
      'failedWithError': "Audio generation failed: {error}"
    }),
    'upload': Object['freeze']({
      'audioOnly': "Only audio files can be uploaded here",
      'missingUrl': "Upload failed: file URL was not returned",
      'anchorMissing': "Upload failed: anchor node not found",
      'sourceAudioName': "Source audio",
      'failedRetry': 'Upload\x20failed.\x20Try\x20again.'
    }),
    'prompt': Object["freeze"]({
      'placeholder': "Describe the audio you want to generate."
    }),
    'debug': Object["freeze"]({
      'buttonTitle': "Debug API parameters",
      'nodeName': "Debug node",
      'paramsShown': 'Final\x20API\x20parameters\x20displayed',
      'buildRequestFailed': "Failed to build request: {error}"
    }),
    'toolbar': Object["freeze"]({
      'cancelAudioSeparation': "Cancel vocal separation"
    }),
    'download': Object["freeze"]({
      'missingAudio': 'No\x20audio\x20to\x20download'
    }),
    'assetTypes': Object['freeze']({
      'text': "Text",
      'image': "Image",
      'video': 'Video',
      'audio': "Audio"
    })
  }),
  'collageNode': Object["freeze"]({
    'errors': Object["freeze"]({
      'exportBlobFailed': "Failed to export collage",
      'emptyImageUrl': "Image URL is empty",
      'imageLoadFailed': "Failed to load image",
      'emptyCollage': "No images to process in this collage",
      'canvasCreateFailed': 'Failed\x20to\x20create\x20collage\x20canvas',
      'nothingDrawn': "No images were rendered",
      'composeFailed': "Collage composition failed",
      'exportFailed': "Failed to export collage"
    }),
    'toolbar': Object["freeze"]({
      'outerPadding': "Outer padding",
      'gap': "Grid spacing",
      'cornerRadius': 'Grid\x20corner\x20radius',
      'edit': "Edit collage",
      'exitEdit': "Exit collage editing",
      'compose': "Compose",
      'composeBusy': 'Composing',
      'composeBusyEllipsis': "Composing...",
      'export': "Export",
      'exportBusy': "Exporting",
      'expand': "Expand",
      'collapse': 'Collapse'
    }),
    'ratio': Object["freeze"]({
      'tooltip': 'Collage\x20ratio',
      'fallback': "Ratio",
      'optionAria': 'Collage\x20ratio\x20{label}'
    }),
    'templates': Object["freeze"]({
      'tooltip': "Collage grid",
      'label': "Collage grid",
      'countAria': "{count}-image templates"
    }),
    'background': Object["freeze"]({
      'tooltip': "Background color",
      'optionAria': "Background {label}"
    }),
    'compose': Object["freeze"]({
      'optionAria': "Compose {label}",
      'created': "Composition complete. Source image node created.",
      'saveFailed': "Composition node created, but save failed."
    }),
    'export': Object['freeze']({
      'optionAria': "Export {label}",
      'exported': "Collage exported"
    }),
    'preview': Object['freeze']({
      'imageAlt': "Collage image",
      'empty': "Empty collage",
      'expandAria': "Expand collage",
      'dividerAria': 'Adjust\x20collage\x20spacing'
    }),
    'output': Object["freeze"]({
      'name': "Collage_{resolution}"
    }),
    'backgrounds': Object["freeze"]({
      'transparent': "Transparent",
      'white': 'White',
      'black': "Black",
      'indigo': 'Indigo',
      'green': "Green",
      'gold': "Gold",
      'red': "Red",
      'purple': "Purple",
      'pink': "Pink",
      'slate': "Slate",
      'cyan': "Cyan"
    }),
    'layouts': Object['freeze']({
      'freeform': 'Freeform',
      'puzzle-2-rows': "Rows",
      'puzzle-2-cols': "Columns",
      'puzzle-3-rows': "Three rows",
      'puzzle-3-cols': "Three columns",
      'puzzle-3-top-wide': "One top, two bottom",
      'puzzle-3-bottom-wide': "Two top, one bottom",
      'puzzle-3-left-tall': "One left, two right",
      'puzzle-3-right-tall': 'Two\x20left,\x20one\x20right',
      'puzzle-3-hero-top': 'Large\x20top',
      'puzzle-3-hero-left': "Large left",
      'puzzle-4-even': "Four grid",
      'puzzle-4-rows': 'Four\x20rows',
      'puzzle-4-cols': "Four columns",
      'puzzle-4-top-wide': 'One\x20top,\x20three\x20bottom',
      'puzzle-4-bottom-wide': "Three top, one bottom",
      'puzzle-4-left-wide': 'One\x20left,\x20three\x20right',
      'puzzle-4-right-wide': 'Three\x20left,\x20one\x20right',
      'puzzle-4-bands': 'Horizontal\x20combination',
      'puzzle-4-hero-top': "Large top"
    })
  }),
  'debugNode': Object["freeze"]({
    'title': "API debug receiver",
    'empty': "// Waiting for request payload...\n// (Click 🔧 Send on another generation node.)\n// You can select and copy this content."
  }),
  'webReferenceCard': Object["freeze"]({
    'openSource': "Open source",
    'sourceLabel': 'Web\x20reference',
    'openFailed': "Unable to open source page",
    'noSelection': "No page text selected"
  }),
  'audioVoicePanel': Object["freeze"]({
    'title': "Voice Studio",
    'betaBadge': 'Beta',
    'fabTitle': "Voice Studio",
    'vip': Object["freeze"]({
      'needAuthorization': "VIP authorization required. Activate your CDKEY first."
    }),
    'close': "Close voice replacement panel",
    'resizeLabel': "Resize voice replacement panel",
    'sections': Object["freeze"]({
      'source': "Media source",
      'mode': "Voice source",
      'sentences': "Sentence track"
    }),
    'source': Object["freeze"]({
      'empty': "No video or audio selected",
      'emptyMeta': "Select a video or audio node",
      'pickNotice': "Select a video or audio",
      'localVideo': "Local video",
      'canvasVideo': "Canvas video",
      'localAudio': "Local audio",
      'canvasAudio': "Canvas audio"
    }),
    'modes': Object['freeze']({
      'clone': "Cloned voice",
      'audioNode': 'Audio\x20node',
      'keep': "Keep original"
    }),
    'sentences': Object["freeze"]({
      'extract': 'Detect\x20original\x20sentences',
      'voice': "Generate replacement voice",
      'compose': "Compose new video",
      'insertedSource': 'New\x20inserted\x20segment,\x20edit\x20source\x20text',
      'sourcePlaceholder': "Source audio text pending",
      'convertedPlaceholder': 'Modified\x20audio\x20not\x20generated',
      'convertedSuffix': "after edit",
      'analysisHint': 'Click\x20Analyze\x20to\x20split\x20the\x20video\x20or\x20audio\x20into\x20sentences'
    }),
    'status': Object['freeze']({
      'pending': "Pending",
      'detected': "Detected",
      'notAnalyzed': "Not analyzed",
      'analyzing': 'Analyzing',
      'edited': "Edited",
      'generating': "Generating",
      'savingAudio': 'Saving\x20audio',
      'stopping': "Stopping",
      'translating': "Translating",
      'composing': "Composing",
      'merging': "Merging",
      'composed': 'Composed',
      'ready': "Ready",
      'removed': "Removed",
      'detectedCount': "{count} sentences detected",
      'noSource': 'No\x20video\x20or\x20audio\x20selected',
      'analysisFailed': "Analysis failed"
    }),
    'progress': Object["freeze"]({
      'asr-runtime-check': "Checking local recognition runtime",
      'asr-runtime-manifest': 'Reading\x20local\x20recognition\x20runtime\x20manifest',
      'asr-runtime-download': "Downloading local recognition runtime",
      'asr-runtime-extract': "Extracting local recognition runtime",
      'asr-runtime-verify': "Verifying local recognition runtime",
      'gpu-torch-check': 'Checking\x20GPU\x20acceleration\x20runtime',
      'gpu-torch-install': "Installing GPU acceleration runtime",
      'gpu-torch-verify': "Verifying GPU acceleration runtime",
      'model-download': 'Preparing\x20subtitle\x20recognition\x20model',
      'model-prepare': "Preparing audio for recognition",
      'transcribe': "Recognizing subtitles",
      'diarization-model-download': "Downloading speaker separation model",
      'diarization-model-prepare': "Loading speaker separation model",
      'diarize': "Separating speakers",
      'slice': 'Cutting\x20sentence\x20audio'
    }),
    'labels': Object["freeze"]({
      'sourceAudio': "Source audio",
      'convertedAudio': 'Modified\x20audio'
    }),
    'actions': Object["freeze"]({
      'loadSelected': "Load video/audio",
      'startAnalyze': "Analyze",
      'startAnalyzeTooltip': "First run may download models. Analyze recognizes speech and cuts sentence audio.",
      'more': 'More\x20options',
      'playAudio': "Preview audio",
      'generateAudio': "Generate audio",
      'editSource': "Edit source audio",
      'editSourceTooltip': 'Edit\x20source\x20audio:\x20trim\x20or\x20split\x20audio.\x20Each\x20segment\x20is\x20used\x20as\x20a\x20voice-clone\x20reference;\x20at\x20least\x203\x20seconds\x20per\x20segment\x20is\x20recommended.',
      'alignSourceText': 'Align\x20source\x20text',
      'history': "History",
      'generate': 'Generate',
      'translate': "Translate",
      'translateTooltip': "Translate all or selected sentences into another language",
      'cancelGeneration': "Cancel generation",
      'batchAudioInputParam': "Batch change audio input",
      'batchAudioInputParamDisabled': 'Select\x20sentence\x20tracks\x20before\x20changing\x20audio\x20input',
      'batchGenerate': "Batch generate",
      'batchGenerateTooltip': "Generate modified audio for every sentence track",
      'selectedGenerate': 'Generate\x20selected',
      'selectedGenerateTooltip': "Generate modified audio only for selected sentence tracks",
      'stopBatchGeneration': "Stop batch generation",
      'composeAll': "Compose",
      'composeAllTooltip': "Compose sentence audio back into the source video or audio by timecode",
      'recomposeTooltip': "Composed. Click to compose again",
      'segmentModel': "Single sentence model",
      'useGlobalModel': "Use global model",
      'segmentModelWithName': 'Single\x20sentence\x20model:\x20{model}',
      'globalSettings': "Global model",
      'globalModelWithName': "Global model: {model}",
      'subtitleRecognitionWithName': "Subtitle recognition: {provider}",
      'segmentGrid': "Segment layout",
      'audioInputParam': "Audio input",
      'changeAudioInputParam': "Change audio input",
      'voiceCloneInputParam': "Click to add voice-line reference",
      'changeVoiceCloneInputParam': "Change voice clone input",
      'clearVoiceCloneInputParam': "Clear voice clone input",
      'imitateTone': 'Imitate\x20tone',
      'imitateToneTooltip': "When enabled, it imitates the original sentence tone",
      'toneCloneBadge': 'Voice\x20conversion',
      'merge': "Merge",
      'insertSegment': "Insert segment"
    }),
    'settings': Object["freeze"]({
      'subtitleRecognition': "Subtitle recognition",
      'voiceModel': "Voice model",
      'noModels': "No voice models available"
    }),
    'asrProviders': Object["freeze"]({
      'bailian': Object['freeze']({
        'label': "Alibaba Cloud Bailian",
        'subtitle': "qwen-audio-3.0-asr-flash-filetrans · Multilingual speaker recognition"
      }),
      'doubao': Object['freeze']({
        'label': "Volcengine Speech",
        'subtitle': "Audio-file recognition big model with automatic multilingual speaker recognition"
      }),
      'funasr': Object['freeze']({
        'label': "Local",
        'subtitle': "Local offline recognition"
      })
    }),
    'bailianAsrApiKeyHelp': Object["freeze"]({
      'missingTitle': "Alibaba Cloud Bailian API key is missing",
      'invalidTitle': "Alibaba Cloud Bailian API key is unavailable",
      'missingMessage': "Subtitle recognition is set to Alibaba Cloud Bailian. Enter its API key in settings.",
      'invalidMessage': "Check your Alibaba Cloud Bailian API key and enable this speech recognition model."
    }),
    'asrApiKeyHelp': Object["freeze"]({
      'missingTitle': "Volcengine Speech API key is missing",
      'invalidTitle': "Volcengine Speech API key is unavailable",
      'missingMessage': "Subtitle recognition is set to Volcengine Speech, but the X-Api-Key is empty.",
      'invalidMessage': "Volcengine Speech connection test failed. Use the X-Api-Key from the Speech API key page, not a Volcengine Ark key, and confirm audio-file recognition is enabled.",
      'howToGet': 'How\x20to\x20get\x20an\x20API\x20key',
      'openSettings': "Open settings",
      'close': "Close",
      'guideTitle': "How to get a Volcengine Speech X-Api-Key",
      'guideSubtitle': "Based on the official Volcengine Speech console guide: subtitle recognition uses the audio-file recognition big model (bigmodel), while dubbing and voice generation also need Speech Synthesis 2.0 and Doubao Audio Generation 1.0. These use the Volcengine Speech X-Api-Key, not a Volcengine Ark key.",
      'guideAlt': "Long guide image for getting a Volcengine Speech X-Api-Key",
      'guideOfficialKey': 'Setup\x20steps',
      'guideNote1': "Sign in to the Volcengine console, open Doubao/Volcengine Speech, and enable Audio-file Recognition 2.0, Speech Synthesis 2.0, and Doubao Audio Generation 1.0.",
      'guideNote2': "Open API Key Management, then create or copy the X-Api-Key and grant it speech recognition, speech synthesis, and Doubao audio generation access.",
      'guideNote3': "Return to Canvas AI Settings > API Key > Volcengine Speech, paste the X-Api-Key, and run the connection test.",
      'guideNote4': 'If\x20the\x20key\x20is\x20leaked\x20or\x20wrong,\x20disable\x20or\x20delete\x20it\x20in\x20the\x20official\x20console\x20and\x20create\x20a\x20new\x20one.',
      'openConsole': 'Open\x20API\x20Key\x20Management'
    }),
    'translationApiKeyHelp': Object['freeze']({
      'missingTitle': "Volcengine Ark API key is missing",
      'invalidTitle': "Translation model is not enabled or the API key is unavailable",
      'missingMessage': "Sentence translation uses a Volcengine Ark Doubao text model, but no API key is configured.",
      'invalidMessage': "The sentence translation model is unavailable. Enable the corresponding Doubao text model in Volcengine Ark and enter a valid API key in settings.",
      'howToGet': 'How\x20to\x20get\x20an\x20API\x20key',
      'openSettings': "Open settings",
      'close': "Close"
    }),
    'toolbar': Object["freeze"]({
      'selectAll': "Select all",
      'cancelSelectAll': 'Clear\x20selection',
      'voice': 'Voice',
      'speed': "Speed",
      'convertLanguage': 'Convert\x20language'
    }),
    'translation': Object["freeze"]({
      'menuLabel': "Choose translation target language",
      'confirmTitle': "Confirm translation",
      'confirmAll': "Translate all {count} sentences into {language}?",
      'confirmSelected': 'Translate\x20the\x20selected\x20{count}\x20sentences\x20into\x20{language}?',
      'cancel': "Cancel",
      'confirm': 'Start\x20translation',
      'languages': Object["freeze"]({
        'zhCN': 'Simplified\x20Chinese',
        'en': "English",
        'ja': 'Japanese',
        'ko': "Korean",
        'es': 'Spanish',
        'fr': "French",
        'de': "German",
        'pt': 'Portuguese'
      })
    }),
    'runtimeRepair': Object["freeze"]({
      'title': 'Local\x20recognition\x20runtime\x20needs\x20repair',
      'message': "The local recognition runtime is missing or damaged. Download it again and retry analysis after repair?",
      'cancel': "Not now",
      'confirm': "Download and repair",
      'failed': 'Failed\x20to\x20repair\x20the\x20local\x20recognition\x20runtime:\x20{message}'
    }),
    'history': Object["freeze"]({
      'empty': "No generated audio yet",
      'play': "Preview history audio",
      'itemTitle': "Generated audio {index}"
    }),
    'menu': Object["freeze"]({
      'useGenerated': "Use generated audio",
      'useSource': "Use original audio",
      'download': 'Download',
      'addToCanvas': 'Add\x20to\x20canvas',
      'sourceAudio': "Original audio",
      'convertedAudio': "Converted audio",
      'remove': "Remove this voice segment"
    }),
    'toasts': Object["freeze"]({
      'selectVideo': 'Select\x20a\x20video\x20node\x20first',
      'selectSource': 'Select\x20a\x20video\x20or\x20audio\x20node\x20first',
      'pipelinePending': "Voice Studio pipeline is not connected yet",
      'playPending': 'Audio\x20preview\x20is\x20not\x20connected\x20yet',
      'sourcePickStarted': 'Pick\x20a\x20video\x20or\x20audio\x20node\x20on\x20the\x20canvas',
      'sourcePickCancelled': "Video/audio picking cancelled",
      'sourcePickUnsupported': 'Pick\x20a\x20video\x20or\x20audio\x20node',
      'videoPickStarted': "Pick a video node on the canvas",
      'videoPickCancelled': 'Video\x20picking\x20cancelled',
      'videoPickUnsupported': "Pick a video node",
      'audioPickStarted': 'Pick\x20an\x20audio\x20node\x20on\x20the\x20canvas',
      'audioPickCancelled': "Audio input picking cancelled",
      'audioPickUnsupported': 'Pick\x20an\x20audio\x20node',
      'audioPickInvalid': "The selected audio node has no local audio",
      'audioPickSelected': "Audio input selected",
      'audioPickBatchSelected': "Audio input applied to {count} sentences",
      'downloadFailed': "Failed to save audio: {message}",
      'addedToCanvas': '{label}\x20added\x20to\x20canvas',
      'addToCanvasFailed': 'Failed\x20to\x20add\x20to\x20canvas:\x20{message}',
      'selectSentenceForVoice': "Select sentence tracks before changing audio input",
      'invalidVideoSource': 'The\x20selected\x20video\x20has\x20no\x20local\x20source\x20yet',
      'invalidSource': "The selected video or audio has no local source yet",
      'analysisComplete': "Analyzed {count} segments",
      'analysisFailed': "Voice analysis failed",
      'asrConfigReadFailed': "Failed to read Volcengine Speech config. Open settings and check the API key.",
      'asrApiKeyMissing': 'Set\x20the\x20Volcengine\x20Speech\x20X-Api-Key\x20in\x20Settings\x20>\x20API\x20Key\x20first.\x20Do\x20not\x20use\x20a\x20Volcengine\x20Ark\x20key.',
      'asrApiKeyInvalid': 'The\x20Volcengine\x20Speech\x20ASR\x20key\x20is\x20invalid.\x20Use\x20the\x20X-Api-Key\x20from\x20the\x20Speech\x20API\x20key\x20page,\x20not\x20an\x20Ark\x20key,\x20and\x20confirm\x20ASR\x20audio-file\x20recognition\x20is\x20enabled.',
      'asrPermissionDenied': 'The\x20Volcengine\x20Speech\x20ASR\x20key\x20has\x20no\x20audio-file\x20recognition\x20permission.\x20Enable\x20the\x20Speech\x20service\x20and\x20ASR\x20access\x20for\x20this\x20key.',
      'noSubtitlesDetected': "No subtitles recognized. Sentence splitting used silence only.",
      'asrRuntimeMismatch': "The background recognition module does not match this interface. Save your work, fully quit and reopen the app, then analyze again.",
      'asrEmptyTranscript': "No speech text was recognized. Check that the audio contains clear speech and try again.",
      'sourceClipApplied': "Source audio split applied",
      'sourceClipFailed': "Source audio split failed",
      'mergeChanged': "The sentence content changed, so this merge was cancelled",
      'sourceClipNeedsAnalysis': "Analyze the source audio before splitting it",
      'noTranslationText': "There is no sentence text to translate",
      'translationConfigReadFailed': "Failed to read the Volcengine Ark config. Open settings and check the API key.",
      'translationComplete': "Translated {count} sentences into {language}",
      'translationFailed': "Sentence translation failed",
      'translationFailedWithMessage': 'Sentence\x20translation\x20failed:\x20{message}',
      'translationStale': "The sentence text or source changed, so this translation was not applied",
      'generateComplete': "Generated replacement audio",
      'generationCompleteSingle': "Voice generation completed.",
      'generationCompleteBatch': 'All\x20{count}\x20voice\x20clips\x20have\x20been\x20generated.',
      'generationBatchSettled': 'Voice\x20generation\x20finished:\x20{succeeded}\x20succeeded,\x20{incomplete}\x20incomplete.',
      'generateFailed': "Audio generation failed",
      'generationCancelled': "Audio generation cancelled",
      'batchCancellationRequested': 'Queued\x20generation\x20stopped.\x20Finishing\x20active\x20tasks.',
      'composeNeedsMoreAudio': "At least one sentence audio is needed to compose",
      'composeFailed': 'Audio\x20composition\x20failed',
      'noGenerateTargets': "No sentence audio can be generated",
      'missingVoiceRefAudio': "Select a voice-line reference audio input first",
      'missingSecondVoiceRefAudio': "Select a voice clone audio input for this model first",
      'missingSourceAudio': "This model needs source audio for the segment",
      'voiceCloneUnsupported': "The current model does not support voice cloning",
      'missingPromptText': "Enter source or modified text before generating",
      'unsupportedVoiceModel': 'This\x20voice\x20model\x20is\x20not\x20supported\x20here\x20yet',
      'audioMissing': "No playable audio for this segment",
      'playUnavailable': "Audio playback is unavailable in this environment",
      'playFailed': "Unable to play audio",
      'localSaveGeneratedFailed': "Generated, but local save failed",
      'operationFailed': "Operation failed"
    })
  }),
  'sceneDetectionNode': Object["freeze"]({
    'title': 'Scene\x20Detection',
    'input': Object['freeze']({
      'videoSource': "Video source",
      'dropVideoHere': "Drag a video node here"
    }),
    'settings': Object["freeze"]({
      'sensitivity': "Detection sensitivity",
      'low': "Low",
      'high': "High"
    }),
    'results': Object["freeze"]({
      'placeholder': "Click Start Detection to analyze video scenes",
      'countPrefix': 'Detected',
      'countSuffix': "scenes"
    }),
    'actions': Object["freeze"]({
      'startDetection': 'Start\x20Detection',
      'detecting': "Detecting...",
      'autoClip': 'Auto\x20clip',
      'exportScenes': "Export scenes",
      'clip': 'Clip'
    }),
    'timeline': Object["freeze"]({
      'changeAt': 'Scene\x20change:\x20{time}'
    }),
    'scene': Object["freeze"]({
      'label': "Scene {index}"
    }),
    'export': Object["freeze"]({
      'unknownVideo': 'Unknown\x20video'
    }),
    'toasts': Object["freeze"]({
      'connectVideoFirst': "Connect a video source first",
      'invalidVideoSource': "Invalid video source",
      'detected': 'Detected\x20{count}\x20scenes',
      'detectFailed': "Scene detection failed. Try again.",
      'createdClipNodes': "Created {count} clip nodes",
      'createdSceneClipNode': "Created clip node for scene {index}",
      'exported': "Scene data exported"
    })
  }),
  'imageCrop': Object["freeze"]({
    'actions': Object['freeze']({
      'exit': "Exit (Esc)",
      'confirm': "Confirm crop",
      'processing': "Processing..."
    }),
    'ratios': Object['freeze']({
      'free': "Free ratio",
      'original': "Original ratio"
    }),
    'output': Object['freeze']({
      'imageFallback': "image",
      'nodeName': 'Cropped\x20from\x20{name}'
    }),
    'errors': Object["freeze"]({
      'sourceLoadFailed': 'Failed\x20to\x20load\x20source\x20image'
    }),
    'toasts': Object["freeze"]({
      'success': "Crop completed",
      'failed': "Crop failed: {error}"
    })
  }),
  'imageMatting': Object['freeze']({
    'tooltips': Object["freeze"]({
      'cancel': "Cancel (Esc)",
      'brush': 'Brush\x20B\x20(press\x20again\x20to\x20switch\x20mode)',
      'brushNormal': "Brush B (press again to switch mode)",
      'brushNormalToggle': 'Brush\x20(click\x20to\x20switch\x20mode)',
      'brushAlphaToggle': "Alpha mask brush (click to switch mode)",
      'eraser': "Eraser E",
      'bucket': 'Paint\x20bucket\x20G',
      'undo': "Undo Ctrl+Z",
      'redo': "Redo Ctrl+Y",
      'clear': "Clear R",
      'save': 'Save'
    }),
    'actions': Object['freeze']({
      'save': "Save",
      'saving': "Saving..."
    }),
    'errors': Object["freeze"]({
      'canvasExportFailed': "Canvas export failed",
      'imageLoadFailed': 'Image\x20load\x20failed'
    }),
    'toasts': Object["freeze"]({
      'noImage': "No image available for matting",
      'cancelled': "Matting cancelled",
      'saveFailed': 'Save\x20failed'
    })
  }),
  'imageAnnotate': Object["freeze"]({
    'edit': Object["freeze"]({
      'title': "Image editing",
      'rotation': "Rotate",
      'annotation': "Annotate",
      'actions': "Actions",
      'left': "Rotate left 90°",
      'right': "Rotate right 90°",
      'angle': "Rotation angle",
      'reset': "Reset angle",
      'keepRatio': 'Keep\x20aspect\x20ratio',
      'dragHint': "Drag horizontally to rotate; Shift: 5° steps; Ctrl: 0.1° steps; click to type an angle"
    }),
    'localEdit': Object['freeze']({
      'mode': "Local edit mode",
      'repaint': "Repaint",
      'erase': 'Remove',
      'prompt': 'Repaint\x20prompt',
      'generateRepaint': "Generate repaint",
      'generateErase': "Generate removal"
    }),
    'toolbar': Object["freeze"]({
      'cancel': "Cancel",
      'brush': 'Brush',
      'rect': "Rectangle",
      'bucket': 'Paint\x20bucket\x20G',
      'text': "Text",
      'eraser': "Eraser",
      'numberLabel': "Number label",
      'color': "Color",
      'flipHorizontal': "Flip horizontal",
      'flipVertical': "Flip vertical",
      'undo': "Undo Ctrl+Z",
      'redo': "Redo",
      'clear': "Clear R",
      'newBoard': 'New\x20board',
      'generate': "Generate",
      'repaintPlaceholder': 'Example:\x20turn\x20the\x20selected\x20person\x20into\x20a\x20puppy',
      'debugApiParams': "Debug API parameters"
    }),
    'colors': Object["freeze"]({
      'red': 'Red',
      'orange': "Orange",
      'yellow': 'Yellow',
      'green': "Green",
      'blue': "Blue",
      'purple': "Purple",
      'black': "Black",
      'white': "White"
    }),
    'actions': Object["freeze"]({
      'save': "Save",
      'generate': "Generate",
      'saving': "Saving...",
      'generating': "Generating..."
    }),
    'debug': Object["freeze"]({
      'nodeName': "Debug node",
      'shown': "Final API parameters shown",
      'buildRequestFailed': "Failed to build request: {error}"
    }),
    'errors': Object["freeze"]({
      'imageLoadFailed': "Image load failed"
    }),
    'output': Object["freeze"]({
      'baseImage': "Image",
      'repaintName': "{baseName} repaint",
      'eraseName': '{baseName}\x20erase',
      'annotateName': "{baseName} edited",
      'repaintCreated': "Repaint image node created",
      'eraseCreated': 'Erase\x20image\x20node\x20created',
      'annotateCreated': "Edited image node created"
    }),
    'toasts': Object["freeze"]({
      'noImage': "No image available to edit",
      'cancelled': "Image editing cancelled",
      'newBoard': "Switched to a new board",
      'saveFailed': "Save failed"
    })
  }),
  'videoReverse': Object["freeze"]({
    'fallback': Object["freeze"]({
      'video': "video"
    }),
    'output': Object["freeze"]({
      'nodeName': "Reversed video: {name}"
    }),
    'status': Object["freeze"]({
      'processing': "Reversing video"
    }),
    'errors': Object["freeze"]({
      'incompleteResult': "Video reverse returned an incomplete result"
    }),
    'toasts': Object["freeze"]({
      'unsupportedNode': "This node does not support video reverse",
      'videoBusy': 'This\x20video\x20is\x20processing.\x20Try\x20again\x20later.',
      'notLocalFile': "This video is not a processable local file",
      'running': "Reversing video...",
      'completed': "Video reverse complete. New video node created.",
      'failed': "Video reverse failed",
      'failedWithError': "Video reverse failed: {error}"
    })
  }),
  'videoGif': Object["freeze"]({
    'loadingPreview': "Loading GIF preview…",
    'cancel': "Cancel and exit",
    'play': "Play preview",
    'pause': "Pause preview",
    'start': 'Start',
    'end': "End",
    'generate': 'Generate\x20GIF',
    'fallbackVideoName': 'Video',
    'limitSize': "Limit size ≤ 1MB (WeChat sticker)",
    'longEdge': "Long edge {size}px",
    'quality': Object["freeze"]({
      'compact': "Compact",
      'balanced': "Balanced",
      'high': "High quality"
    }),
    'rangeSummary': "{start} – {end} · {duration}s",
    'wechatTarget': 'Adaptive\x20WeChat\x20target\x20≤\x20{size}',
    'unlimitedOutput': 'No\x20size\x20limit',
    'encoding': 'Generating\x20GIF…',
    'optimizing': "Optimizing GIF size for WeChat…",
    'preparing': "Preparing video…",
    'completedOverTarget': "GIF generated ({size}), but still exceeds the WeChat recommendation",
    'completed': "GIF generated ({size})",
    'cancelled': "GIF generation cancelled",
    'resultName': "GIF: {name}",
    'errors': Object['freeze']({
      'noSource': "The current video has no usable source",
      'previewFailed': 'GIF\x20preview\x20failed\x20to\x20load:\x20{error}',
      'localSourceRequired': "Save the video locally before generating a GIF",
      'taskUnavailable': 'GIF\x20conversion\x20is\x20unavailable',
      'generateFailed': "GIF generation failed: {error}",
      'incompleteResult': "GIF conversion returned an incomplete result"
    })
  }),
  'groupExecution': Object['freeze']({
    'groupNotFound': "No executable group node found",
    'groupNoExecutable': "No executable generation nodes in this group",
    'groupTriggered': "Triggered {count} generation nodes in the group",
    'groupRunning': "Generation nodes in this group are already running",
    'groupNoTriggerable': 'No\x20triggerable\x20generation\x20buttons\x20in\x20this\x20group',
    'groupCancelTriggered': "Requested cancellation for {count} group generation nodes",
    'selectedCancelTriggered': "Requested cancellation for {count} selected generation nodes",
    'selectedNoExecutable': "No executable generation nodes selected",
    'selectedTriggered': 'Triggered\x20{count}\x20selected\x20generation\x20nodes',
    'selectedRunning': 'Selected\x20generation\x20nodes\x20are\x20already\x20running',
    'selectedNoTriggerable': "No triggerable generation buttons in the selection",
    'stopSelected': "Stop selected generation"
  }),
  'imageGridCrop': Object['freeze']({
    'errors': Object["freeze"]({
      'canvasBlobFailed': "Canvas toBlob failed",
      'canvasCorsBlocked': "Canvas export blocked (CORS)",
      'localImageLoadFailed': "Failed to load local source image",
      'noImage': 'No\x20image\x20available\x20to\x20crop',
      'localFileReadFailed': "Failed to read local file. Check whether it still exists.",
      'sourceMaybeRemoved': "Failed to load source image. The local file may have been removed.",
      'sourceNodeMissing': "Source node not found"
    }),
    'output': Object["freeze"]({
      'nodeName': 'Crop\x20{row}-{col}'
    })
  }),
  'imageExpand': Object['freeze']({
    'ratio': Object["freeze"]({
      'original': "Original ratio",
      'selectedOriginal': 'Ratio'
    }),
    'actions': Object['freeze']({
      'exit': "Exit (Esc)",
      'debugApiParams': "Debug API parameters",
      'generate': "Generate expansion"
    }),
    'task': Object["freeze"]({
      'submitting': 'Submitting',
      'generating': "Generating",
      'completed': 'Completed',
      'failed': "Generation failed"
    }),
    'output': Object["freeze"]({
      'promptDisplay': "Remove the green area and generate matching scene content inside it",
      'started': "Model: {model}\nPrompt: {prompt}",
      'failed': "Model: {model}\nPrompt: {prompt}\nError: {error}",
      'generatingName': "Expanding...",
      'failedName': 'Expansion\x20failed',
      'resultName': "Expanded image"
    }),
    'debug': Object["freeze"]({
      'nodeName': "Debug node"
    }),
    'errors': Object["freeze"]({
      'createExpandedImageFailed': "Unable to create the expanded image",
      'sourceImageLoadFailed': "Unable to load the source image",
      'unknown': "Unknown error"
    }),
    'toasts': Object["freeze"]({
      'sourceNodeMissing': 'Source\x20node\x20not\x20found.\x20Unable\x20to\x20build\x20debug\x20parameters.',
      'debugShown': 'Expansion\x20API\x20parameters\x20shown',
      'debugBuildFailed': "Failed to build debug parameters: {error}",
      'generating': 'Generating\x20expansion...',
      'success': 'Expansion\x20generated\x20successfully',
      'failed': "Expansion failed: {error}"
    })
  }),
  'imageFreeAngle': Object["freeze"]({
    'runningTask': Object['freeze']({
      'clickCancel': "Click to cancel",
      'cancel': "Cancel",
      'clickCancelTask': "Click to cancel task"
    }),
    'actions': Object["freeze"]({
      'exit': 'Exit',
      'exitControl': 'Exit\x20angle\x20control',
      'reset': 'Reset',
      'debugApiParams': "Debug API parameters",
      'generate': "Generate"
    }),
    'panel': Object["freeze"]({
      'title': 'Drag\x20the\x20cube\x20to\x20change\x20angle'
    }),
    'cube': Object["freeze"]({
      'back': "Back",
      'right': "Right",
      'left': 'Left',
      'top': "Top",
      'bottom': "Bottom"
    }),
    'controls': Object['freeze']({
      'rotation': "Horizontal angle",
      'pitch': 'Vertical\x20angle',
      'distance': "Distance"
    }),
    'task': Object["freeze"]({
      'submitting': "Submitting",
      'generating': 'Generating',
      'completed': "Completed",
      'failed': "Generation failed"
    }),
    'output': Object['freeze']({
      'generatingName': "Rotating...",
      'resultName': "Rotation result",
      'failedName': 'Generation\x20failed',
      'angle': "Model: {model}\nCamera angle: rotate {rotation}° · pitch {pitch}° · zoom {scale}",
      'failedReason': "Failure reason: {error}"
    }),
    'debug': Object["freeze"]({
      'nodeName': 'Debug\x20node'
    }),
    'errors': Object["freeze"]({
      'noGeneratedImageUrl': "Unable to get generated image URL",
      'unknown': "Unknown error"
    }),
    'toasts': Object["freeze"]({
      'success': "Image generated successfully",
      'failed': 'Generation\x20failed:\x20{error}',
      'debugBuildFailed': "Failed to build debug parameters: {error}"
    })
  }),
  'aigenVideoNode': Object["freeze"]({
    'vip': Object["freeze"]({
      'modelFallback': "this model"
    }),
    'upload': Object["freeze"]({
      'noFileUrl': "Upload failed: no file URL returned",
      'anchorMissing': 'Upload\x20failed:\x20anchor\x20node\x20not\x20found',
      'videoOnly': "Only video files can be uploaded here",
      'imageOnly': "Only image files can be uploaded here",
      'audioOnly': "Only audio files can be uploaded here",
      'unsupportedAsset': 'This\x20slot\x20does\x20not\x20support\x20this\x20asset\x20type',
      'failedRetry': "Upload failed. Try again."
    }),
    'inputNames': Object["freeze"]({
      'maskVideo': 'Mask\x20video',
      'sourceVideo': 'Source\x20video',
      'sourceAudio': "Source audio"
    }),
    'prompt': Object['freeze']({
      'placeholder': "Describe the video, @ reference assets, or type / for commands..."
    }),
    'ratio': Object["freeze"]({
      'adaptive': "Adaptive"
    }),
    'help': Object["freeze"]({
      'ariaLabel': "Generation node help"
    })
  }),
  'videoTask': Object["freeze"]({
    'controls': Object["freeze"]({
      'generateTitle': 'Generate\x20video',
      'cancelTooltip': "Click generate again to cancel the running task",
      'cancelGenerateAria': "Cancel video generation"
    }),
    'task': Object["freeze"]({
      'queueing': "Queueing",
      'backgroundQueueing': 'Queueing\x20(background\x20polling)',
      'submitting': "Submitting",
      'generating': 'Generating',
      'completed': "Completed",
      'queryFailed': "Query failed",
      'staleRecoveryStopped': "The historical task status could not be confirmed, so background polling was stopped: {message}",
      'generationFailed': "Generation failed",
      'generationCancelled': "Generation cancelled",
      'videoGenerationFailed': 'Video\x20generation\x20failed'
    }),
    'validation': Object['freeze']({
      'localVideoMissing': "The local video file is missing. Select or upload it again: {path}",
      'removePromptVideoRefs': ", remove @video references from the prompt",
      'imageModeRejectsVideo': "Image-to-video mode does not accept video inputs{hint}",
      'imageModeNeedsFirstFrame': "Image-to-video mode needs 1 first-frame image",
      'referenceImageModeRejectsVideo': "Reference image-to-video mode does not accept video inputs{hint}",
      'referenceImageModeNeedsReference': "Reference image-to-video mode needs at least 1 reference image",
      'videoEditNeedsVideo': 'Video\x20edit\x20mode\x20needs\x201\x20video\x20input',
      'videoEditNeedsSourceVideo': "Video edit mode needs 1 source video input",
      'videoEditRejectsImageUseReferenceVideo': "Video edit mode does not support image inputs. Use a reference video.",
      'videoEditRejectsImage': "Video edit mode does not support image inputs",
      'videoEditRejectsAudio': "Video edit mode does not support audio inputs",
      'videoExtendRejectsImage': 'Video\x20extension\x20mode\x20does\x20not\x20accept\x20image\x20inputs{hint}',
      'videoExtendRejectsAudio': "Video extension mode does not support audio inputs",
      'referenceVideoNeedsMedia': "Reference video mode needs a reference image or video",
      'referenceAudioNeedsImage': "Reference video audio needs a reference image for voice style",
      'mediaInputLimits': Object['freeze']({
        'maxImages': "Image inputs cannot exceed {max} files",
        'maxVideos': 'Video\x20inputs\x20cannot\x20exceed\x20{max}\x20files',
        'maxAudios': "Audio inputs cannot exceed {max} files",
        'maxTotalVideoSeconds': 'The\x20total\x20duration\x20of\x20video\x20inputs\x20cannot\x20exceed\x20{max}s',
        'maxVideoInputAndOutputSeconds': 'Reference\x20and\x20generated\x20videos\x20cannot\x20exceed\x20{max}\x20seconds\x20in\x20total',
        'maxTotalAudioSeconds': "The total duration of audio inputs cannot exceed {max}s",
        'minImageSeconds': "Each image input must be at least {min}s",
        'maxImageSeconds': 'Each\x20image\x20input\x20cannot\x20exceed\x20{max}s',
        'minVideoSeconds': 'Each\x20video\x20input\x20must\x20be\x20at\x20least\x20{min}s',
        'maxVideoSeconds': 'Each\x20video\x20input\x20cannot\x20exceed\x20{max}s',
        'minAudioSeconds': 'Each\x20audio\x20input\x20must\x20be\x20at\x20least\x20{min}s',
        'maxAudioSeconds': "Each audio input cannot exceed {max}s",
        'invalidImageExtension': "Unsupported image format. Use one of: {allowed}",
        'invalidVideoExtension': "Unsupported video format. Use one of: {allowed}",
        'invalidAudioExtension': 'Unsupported\x20audio\x20format.\x20Use\x20one\x20of:\x20{allowed}',
        'maxImageMegabytes': "Each image input cannot exceed {max} MB",
        'maxVideoMegabytes': 'Each\x20video\x20input\x20cannot\x20exceed\x20{max}\x20MB',
        'maxAudioMegabytes': 'Each\x20audio\x20input\x20cannot\x20exceed\x20{max}\x20MB'
      }),
      'happyHorse': Object['freeze']({
        'promptRequired': "HappyHorse 1.0 requires a prompt",
        'chooseMode': "Choose a HappyHorse 1.0 mode before generating",
        'editUnsupported': "The current HappyHorse model does not support video edit mode. Use image-to-video or reference image-to-video instead.",
        'editVideoMaxSeconds': "HappyHorse 1.0 video edit input cannot exceed {seconds}s. Trim it before generating."
      }),
      'wan27': Object['freeze']({
        'audioDuration': 'Wan2.7\x20audio\x20must\x20be\x202-30s.\x20Replace\x20or\x20trim\x20it\x20before\x20generating.',
        'audioSize': 'Wan2.7\x20audio\x20must\x20be\x20under\x2015MB.\x20Compress\x20it\x20before\x20generating.',
        'extendMaxSeconds': "Wan2.7 video extension input cannot exceed 10s. Trim it before generating.",
        'referenceVideoMaxSeconds': "Wan2.7 reference video cannot exceed 30s. Trim it before generating.",
        'editVideoDuration': "Wan2.7 edit source video must be 2-10s. Trim it before generating."
      }),
      'klingV3Omni': Object["freeze"]({
        'editVideoDuration': "Kling V3 Omni edit source video must be 3-10s. Trim it before generating."
      }),
      'klingO1': Object["freeze"]({
        'editAndFeatureExclusive': "Kling O1 edit video and feature reference video cannot both be connected",
        'onlyOneVideo': "Kling O1 supports only 1 video. Keep either the edit video or feature reference video.",
        'referenceVideoDuration': "Kling O1 reference video must be 3-10s. Trim it before generating.",
        'editVideoRejectsImage': 'Kling\x20O1\x20edit\x20video\x20cannot\x20also\x20use\x20reference\x20images.\x20Remove\x20reference\x20images\x20before\x20generating.',
        'featureVideoMaxOneImage': "Kling O1 feature reference video can use only 1 reference image at the same time"
      })
    }),
    'cancel': Object["freeze"]({
      'missingApiKey': "Cancel failed: missing API Key",
      'interruptedNoTaskId': "Generation interrupted: task ID has not returned yet",
      'failed': 'Cancel\x20failed',
      'success': "Cancel succeeded",
      'taskNotFound': "Task not found",
      'interrupted': 'Generation\x20interrupted'
    }),
    'errors': Object["freeze"]({
      'missingAsyncResumeModelOrProvider': 'Missing\x20model\x20or\x20provider\x20information\x20required\x20to\x20resume\x20async\x20video'
    }),
    'toasts': Object["freeze"]({
      'localSaveFailed': "Video generated, but saving locally to output failed: {error}",
      'missingInstallId': "Missing installId. Refresh and try subscription verification again.",
      'subscriptionSyncing': "Subscription status is syncing. Try again shortly.",
      'dreaminaBackgroundQueueing': "Dreamina has been queueing for a while. Switched to background polling.",
      'smartMultiframeUnavailable': "Smart multi-frame is not available yet"
    })
  }),
  'panoramaSceneNode': Object["freeze"]({
    'defaults': Object['freeze']({
      'sceneNodeName': '3D\x20Stage',
      'panorama360NodeName': "360 Panorama"
    }),
    'toolbar': Object["freeze"]({
      'edit': "Edit",
      'closeEdit': "Close edit",
      'uploadPanorama': 'Upload\x20panorama',
      'fullscreen': "Fullscreen",
      'exitFullscreen': "Exit fullscreen",
      'collapse': "Collapse",
      'expand': "Expand",
      'mouse': 'Mouse',
      'mouseMode': "Mouse mode",
      'boxSelectMouse': 'Box\x20select',
      'flyMode': "Fly mode [Shift+F]",
      'frameSelection': "Frame selection [F]",
      'move': 'Move',
      'rotate': 'Rotate',
      'scale': "Scale",
      'switchEnvironment': "Switch environment",
      'switchToNight': "Switch to night",
      'switchToDay': "Switch to day",
      'createCube': "Create cube",
      'assetLibrary': "Scene assets",
      'mannequin': 'Mannequin',
      'poseEditor': "Mannequin pose",
      'grid': "Grid layout",
      'capture': "Screenshot",
      'captureWithMode': 'Screenshot\x20·\x20{mode}',
      'createCameraBookmark': 'Create\x20camera\x20bookmark',
      'cameraTimeline': "Camera timeline",
      'transformWorld': 'World\x20space',
      'transformLocal': "Local space",
      'snap': "Snap",
      'groundLock': "Ground lock",
      'uniformScale': 'Uniform\x20scale',
      'focus': "Focal length",
      'resetView': "Reset view"
    }),
    'assets': Object["freeze"]({
      'title': 'Scene\x20assets\x20({count})',
      'categoryAria': "Asset category",
      'searchPlaceholder': 'Search\x20assets',
      'searchAria': 'Search\x20scene\x20assets',
      'empty': "No matching assets",
      'categories': Object["freeze"]({
        'all': 'All',
        'architecture': 'Architecture',
        'furniture': "Furniture",
        'stage': "Stage",
        'props': "Props",
        'nature': "Nature"
      })
    }),
    'poseEditor': Object["freeze"]({
      'title': "Mannequin pose",
      'presetAria': 'Pose\x20preset',
      'custom': 'Custom',
      'boneAria': "Character bone",
      'saveCustom': "Save custom pose",
      'customName': "Custom pose {suffix}",
      'bones': Object["freeze"]({
        'root': "Root",
        'pelvis': "Pelvis",
        'spine_01': "Lower spine",
        'spine_02': "Spine",
        'spine_03': "Upper spine",
        'neck_01': "Neck",
        'Head': "Head",
        'clavicle_l': 'Left\x20clavicle',
        'clavicle_r': "Right clavicle",
        'upperarm_l': "Left upper arm",
        'upperarm_r': 'Right\x20upper\x20arm',
        'lowerarm_l': "Left forearm",
        'lowerarm_r': "Right forearm",
        'hand_l': "Left hand",
        'hand_r': "Right hand",
        'thigh_l': "Left thigh",
        'thigh_r': 'Right\x20thigh',
        'calf_l': "Left lower leg",
        'calf_r': "Right lower leg",
        'foot_l': "Left foot",
        'foot_r': "Right foot"
      })
    }),
    'cameraTimeline': Object['freeze']({
      'play': "Play",
      'pause': "Pause",
      'playAria': 'Play\x20camera\x20animation',
      'pauseAria': "Pause camera animation",
      'addKeyframe': "Add keyframe",
      'addKeyframeAria': 'Add\x20camera\x20keyframe',
      'trackAria': "Camera timeline",
      'duration': "Duration (seconds)",
      'durationAria': "Animation duration in seconds",
      'fps': "Frame rate",
      'fpsAria': "Camera animation frame rate",
      'loop': "Loop",
      'keyframeTitle': '{time},\x20frame\x20{frame}',
      'keyframeAria': 'Camera\x20keyframe\x20at\x20{time},\x20frame\x20{frame}'
    }),
    'contextMenu': Object['freeze']({
      'deleteObject': "Delete object"
    }),
    'capture': Object['freeze']({
      'modes': Object['freeze']({
        'adaptive': "Adaptive",
        'vertical': "9:16",
        'cinema': "2.35:1"
      }),
      'modeAria': "Screenshot ratio {label}",
      'nodeName': "Scene screenshot",
      'pending': "Screenshot in progress",
      'noImage': "No screenshot image was captured",
      'success': "Screenshot source image node created",
      'saveInvalidPath': "Screenshot is visible, but local save did not return a valid path",
      'localSaveFailed': "Local save failed",
      'localSaveWarning': "Screenshot is visible, but local save failed",
      'failed': "Screenshot failed",
      'failedWithError': "Screenshot failed: {error}"
    }),
    'camera': Object["freeze"]({
      'bookmarkAria': "Camera bookmark {slot}",
      'deleteBookmark': "Delete camera bookmark",
      'defaultName': 'Camera\x20{slot}',
      'fallbackName': "Camera",
      'limitWarning': "You can create up to {count} cameras"
    }),
    'focus': Object["freeze"]({
      'title': "Focal length",
      'sliderAria': "Current camera focal length"
    }),
    'grid': Object["freeze"]({
      'title': 'Grid\x20layout',
      'rows': "Rows",
      'cols': "Columns",
      'spacingX': "Spacing X",
      'spacingZ': "Spacing Z",
      'gender': 'Gender',
      'color': "Color",
      'rowsAria': "Row count",
      'colsAria': 'Column\x20count',
      'spacingXAria': 'Spacing\x20X\x20in\x20meters',
      'spacingZAria': "Spacing Z in meters",
      'setGenderAria': 'Use\x20{label}\x20mannequin',
      'setColorAria': "Set {label} color",
      'apply': 'Create\x20layout'
    }),
    'mannequin': Object['freeze']({
      'title': "Create mannequin",
      'setGenderAria': "Choose {label} mannequin",
      'createColorAria': "Create {label} mannequin",
      'genders': Object["freeze"]({
        'male': "male",
        'female': "female"
      }),
      'colors': Object["freeze"]({
        'red': "red",
        'green': 'green',
        'blue': "blue",
        'yellow': "yellow",
        'purple': "purple",
        'cyan': 'cyan',
        'white': 'white'
      })
    }),
    'status': Object["freeze"]({
      'cameraSelected': "Camera selected",
      'objectSelected': "Object selected",
      'noObjectSelected': 'No\x20object\x20selected',
      'panoramaMode': "Panorama mode",
      'sceneMode': "Scene mode",
      'editing': "Editing · {mode} · {selection}",
      'collapsed': 'Collapsed',
      'normalNode': 'Normal\x20node'
    }),
    'hint': Object["freeze"]({
      'doubleClickEdit': "Double-click to edit",
      'clickEditPanorama': "Click Edit to enter panorama",
      'clickEditScene': "Click Edit to enter scene",
      'panoramaControls': "Drag to rotate view, scroll to zoom",
      'boxSelect': "Box select: drag to select objects",
      'flyControls': 'Fly:\x20right-drag\x20to\x20look,\x20WASD\x20move,\x20Q/E\x20descend/ascend,\x20Shift\x20boosts',
      'defaultMouse': "Mouse: drag empty space to orbit, drag objects on XZ"
    }),
    'upload': Object["freeze"]({
      'unsupportedNode': '3D\x20Stage\x20does\x20not\x20support\x20panorama\x20upload.\x20Use\x20a\x20360\x20Panorama\x20node.',
      'ratioWarning': "This image is {width}×{height} (ratio {ratio}), not a standard 2:1 panorama. It may appear stretched.",
      'success': 'Panorama\x20uploaded',
      'failed': "Upload failed",
      'failedWithError': "Panorama upload failed: {error}"
    }),
    'errors': Object["freeze"]({
      'unknown': "Unknown error",
      'captureCropFailed': "Failed to crop screenshot",
      'captureExportFailed': "Failed to export screenshot",
      'panoramaLoadFailed': "Failed to load panorama",
      'pngNormalizeFailed': 'Failed\x20to\x20normalize\x20360\x20panorama\x20PNG',
      'pngSaveInvalidPath': 'PNG\x20save\x20failed:\x20no\x20valid\x20path\x20returned',
      'panoramaImageInputMissing': "360 Panorama is missing a usable image input",
      'readPanoramaInputFailed': "Failed to read 360 panorama input: {error}",
      'panoramaInputEmpty': 'Failed\x20to\x20read\x20360\x20panorama\x20input:\x20empty\x20response',
      'panoramaPngConvertFailed': 'Failed\x20to\x20normalize\x20360\x20panorama\x20PNG:\x20unable\x20to\x20convert\x20to\x20PNG'
    })
  }),
  'audioClip': Object["freeze"]({
    'controls': Object['freeze']({
      'cancel': "Cancel",
      'split': 'Split',
      'undoSplit': 'Undo\x20split',
      'done': 'Done'
    }),
    'helpers': Object['freeze']({
      'cancel': 'Cancel',
      'playPauseRange': 'Play/pause\x20range',
      'moveRange': "Move trim range",
      'moveRangeLarge': "Move trim range by larger steps",
      'setInOut': "Set in/out points",
      'fineTuneIn': "Fine-tune in point",
      'fineTuneOut': 'Fine-tune\x20out\x20point',
      'wheelKey': "Wheel",
      'sameAsArrows': "Same as arrow keys",
      'doubleClickSelection': "Double-click selection",
      'restoreDefault': "Restore default 3s"
    }),
    'status': Object['freeze']({
      'loading': "Loading..."
    }),
    'output': Object["freeze"]({
      'audioFallback': "audio",
      'nodeName': "Clipped from {name}"
    }),
    'errors': Object["freeze"]({
      'cutApiMissing': "Backend endpoint missing: /api/v2/audio/cut (restart server.py)",
      'cutFailed': "Audio clipping failed"
    }),
    'toasts': Object["freeze"]({
      'uploadFirst': "Upload audio first",
      'playerMissing': "Audio player not found",
      'cutting': "Cutting audio on backend...",
      'splitAtMiddle': "Move the playhead inside the selected range before splitting",
      'success': "Audio clip created as a new file",
      'failed': "Audio clipping failed: {error}",
      'cancelled': 'Audio\x20clipping\x20cancelled'
    })
  }),
  'videoKeying': Object["freeze"]({
    'models': Object["freeze"]({
      'keying': 'RH\x20video\x20keying',
      'remove': "RH video removal"
    }),
    'status': Object['freeze']({
      'processing': "Processing",
      'completed': 'Completed',
      'cancelled': "Cancelled",
      'failed': "Failed"
    }),
    'output': Object["freeze"]({
      'withTask': "Model: {model}\nTask: {taskId}\nStatus: {status}",
      'status': "Model: {model}\nStatus: {status}",
      'failed': "Model: {model}\nStatus: {status}\nReason: {reason}",
      'removeGeneratingName': "Video removal generating...",
      'removeResultName': "Video removal result",
      'removeFailedName': 'Video\x20removal\x20failed',
      'keyingResultName': "Keying result {name}",
      'videoFallback': "video"
    }),
    'tools': Object["freeze"]({
      'cancel': "Cancel",
      'brush': "Brush",
      'eraser': "Eraser",
      'undo': "Undo",
      'redo': 'Redo',
      'clear': "Clear",
      'clearAll': 'Clear\x20all',
      'keying': "Keying",
      'remove': "Video removal",
      'settings': "Settings"
    }),
    'hint': Object["freeze"]({
      'removeTitle': "Video removal",
      'shortcutPrefix': '\x20\x20·\x20\x20Shortcuts:\x20',
      'wheelBrushSize': '\x20\x20·\x20\x20Mouse\x20wheel\x20adjusts\x20brush\x20size',
      'leftClick': 'Left\x20click',
      'selectTarget': "select target",
      'rightClick': "Right click",
      'excludeTarget': 'exclude\x20target',
      'clearAllPoints': "Clear all points"
    }),
    'helper': Object["freeze"]({
      'meta': 'FPS:\x20{fps}\x20·\x20Resolution:\x20{resolution}\x20·\x20Frame:\x20{frameIndex}'
    }),
    'settings': Object["freeze"]({
      'title': 'Parameters',
      'resolution': "Resolution",
      'resolutionTip': "Higher resolution preserves more detail and steadier edges.\nIt also uses more VRAM and takes longer to generate.",
      'fps': "Frame rate",
      'fpsValue': '{fps}\x20fps',
      'fpsTip': "Higher frame rate makes motion smoother and more continuous.\nIt also generates more slowly and costs more.\n24 fps is common; choose 16 fps for faster or cheaper runs, or 30 fps for smoother motion.",
      'maskMode': "Keying mode",
      'maskModeTip': "Sec: default mode for most keying tasks.\nSam3: better for complex subjects or finer edges.\nMA2: compatible with the legacy MatAnyone2 workflow.",
      'vram': "VRAM",
      'vramTip': "48G can run larger resolutions or more frames, at 2x cost.",
      'debugParams': "Debug parameters"
    }),
    'errors': Object["freeze"]({
      'maskSizeInvalid': 'Unable\x20to\x20calculate\x20the\x20video\x20removal\x20mask\x20size',
      'noBrush': "Paint the area to remove on the video first",
      'maskCanvasUnavailable': 'Unable\x20to\x20create\x20the\x20video\x20removal\x20mask',
      'noVideoUrl': "No video URL returned",
      'removeMaskFailed': "Failed to generate the video removal mask",
      'removeFailed': "Video removal failed",
      'keyingFailed': "Keying failed",
      'maskExportFailed': "Unable to export the removal mask",
      'unknown': 'Unknown\x20error'
    }),
    'debug': Object["freeze"]({
      'nodeName': 'Debug\x20node'
    }),
    'toasts': Object['freeze']({
      'connectSourceVideoFirst': "Connect a source video first",
      'configReadFailed': 'Failed\x20to\x20read\x20RunningHub\x20config.\x20Open\x20settings\x20and\x20check\x20the\x20API\x20Key.',
      'apiKeyMissing': "Add the RunningHub API Key in settings first",
      'removeSuccess': "Video removal generated successfully",
      'removeFailed': "Video removal failed: {error}",
      'sourceVideoTooLarge': "The trimmed video is still over {maxMB}MB. Keep trimming or compress it.",
      'keyingSubmitting': 'Submitting\x20RH\x20video\x20keying\x20task...',
      'keyingSuccess': "Keying complete. New video created.",
      'keyingFailed': 'Keying\x20failed:\x20{error}',
      'keyingCancelled': "Cancelled the keying task for this video",
      'removeCancelled': "Cancelled the removal task for this video",
      'clearedPoints': 'All\x20points\x20cleared',
      'debugBuildFailed': "Failed to build debug parameters: {error}",
      'debugRemoveShown': "RH video removal request parameters shown",
      'debugKeyingShown': "RH keying request parameters shown",
      'debugFailed': "Debug failed: {error}",
      'removeClosed': "Video removal closed",
      'keyingClosed': 'Keying\x20closed'
    })
  }),
  'devEntry': Object['freeze']({
    'buttons': Object["freeze"]({
      'dev': 'Dev',
      'preview': 'Preview',
      'upload': 'Upload',
      'updatePreview': 'Update\x20Preview'
    }),
    'titles': Object["freeze"]({
      'devOn': "Developer mode is on. Click to turn it off.",
      'devOff': "Turn on developer mode",
      'previewOn': "Preview mode is on. Click to turn it off.",
      'previewOff': "Turn on preview mode",
      'upload': "Upload preview result to the selected node",
      'updatePreview': "Preview online update information"
    }),
    'toasts': Object["freeze"]({
      'devOn': "Developer mode enabled",
      'devOff': "Returned to normal mode",
      'previewOn': "Preview mode enabled",
      'previewOff': "Preview mode disabled"
    })
  }),
  'mascot': Object["freeze"]({
    'tips': Object["freeze"]({
      'viewWheelZoom': '💡\x20View:\x20Use\x20the\x20mouse\x20wheel\x20to\x20zoom\x20the\x20canvas.\x20The\x20lower-right\x20slider\x20gives\x20finer\x20control.',
      'viewShortcutZoom': '💡\x20View:\x20{zoomIn}\x20/\x20{zoomOut}\x20quickly\x20zooms\x20in\x20or\x20out.',
      'viewFocus': "💡 View: Press {shortcut} to focus selected nodes. With nothing selected, it fits the whole canvas.",
      'viewMinimap': "💡 View: Press {shortcut} to show or hide the minimap.",
      'viewSpacePan': "💡 View: Hold {shortcut} and drag with the left mouse button to pan the canvas.",
      'viewMiddlePan': "💡 View: Drag with the middle mouse button to pan quickly.",
      'createDoubleClick': "💡 Create: Double-click an empty canvas area to open the node creation menu.",
      'createLeftPlus': "💡 Create: Click the left plus button to open all nodes and upload local media.",
      'createNote': '💡\x20Create:\x20Press\x20{shortcut}\x20to\x20quickly\x20create\x20a\x20note\x20node\x20for\x20notes\x20and\x20to-dos.',
      'createTextImage': '💡\x20Create:\x20Press\x20{text}\x20for\x20a\x20text\x20generation\x20node,\x20{image}\x20for\x20an\x20image\x20generation\x20node.',
      'createVideoAudio': '💡\x20Create:\x20Press\x20{video}\x20for\x20a\x20video\x20generation\x20node,\x20{audio}\x20for\x20an\x20audio\x20generation\x20node.',
      'createDragMedia': "💡 Create: Drag images, videos, or audio onto the canvas to create matching source nodes.",
      'editSelectAll': "💡 Edit: {shortcut} selects all nodes on the canvas.",
      'editShiftSelect': "💡 Edit: Hold {shortcut} and click nodes to add or remove them from the selection.",
      'editBoxSelect': "💡 Edit: Drag on empty canvas space to box-select multiple nodes.",
      'editCopyPaste': "💡 Edit: {copy} copies nodes, {paste} pastes nodes.",
      'editCut': "💡 Edit: {shortcut} cuts the selected nodes.",
      'editDelete': "💡 Edit: Select nodes and press {shortcut} to delete them.",
      'editUndoRedo': "💡 Edit: {undo} undoes, {redo} redoes.",
      'organizeGroup': "💡 Organize: Select multiple nodes and press {shortcut} to group them.",
      'organizeAlign': '💡\x20Organize:\x20Select\x20multiple\x20nodes\x20and\x20press\x20{shortcut}\x20to\x20open\x20the\x20alignment\x20panel.',
      'organizeGuides': "💡 Organize: Press {shortcut} to toggle guide snapping.",
      'organizeGrid': '💡\x20Organize:\x20Press\x20{shortcut}\x20to\x20toggle\x20grid\x20snapping.',
      'organizeResetSize': "💡 Organize: Select an image or video node and press {shortcut} to restore its default size.",
      'edgeConnect': '💡\x20Connections:\x20Drag\x20from\x20a\x20node\x20connector\x20to\x20another\x20node\x20to\x20create\x20an\x20edge.',
      'edgeCut': "💡 Connections: Hold {shortcut} and swipe across an edge to cut it quickly.",
      'edgeScissors': "💡 Connections: Hover an edge briefly to reveal scissors, then click to delete it.",
      'nodeRename': "💡 Nodes: Double-click a node title or label to rename it.",
      'imageTools': '💡\x20Images:\x20Select\x20one\x20image\x20node\x20and\x20use\x20{shortcuts}\x20to\x20trigger\x20mask,\x20redraw,\x20erase,\x20and\x20other\x20image\x20tools.',
      'imageCopy': "💡 Images: {shortcut} copies the image from the selected image node.",
      'videoTools': "💡 Videos: Select one video node and use {shortcuts} for crop, keying, HD, fullscreen, and download.",
      'videoCaptureFrame': "💡 Videos: Select one video node and press {shortcut} to capture the current frame.",
      'audioTools': "💡 Audio: Select one audio node and use {shortcuts} for trim, speed, and download.",
      'textTools': '💡\x20Text:\x20Select\x20one\x20text\x20node\x20and\x20use\x20{shortcuts}\x20for\x20copy\x20content\x20and\x20fullscreen\x20view.',
      'sceneTools': "💡 3D: In the 3D director stage, use {shortcuts} for mouse mode, move, scale, and rotate.",
      'sceneCapture': '💡\x203D:\x20In\x20the\x203D\x20director\x20stage,\x20press\x20{shortcut}\x20to\x20capture\x20a\x20screenshot.',
      'projectSave': "💡 Project: {shortcut} saves the current canvas project.",
      'projectSettings': "💡 Project: Press {shortcut} to open settings.",
      'settingsShortcuts': "💡 Settings: Keyboard shortcuts can be customized to match your habits.",
      'hintEsc': "💡 Tip: Press Esc to close menus, dialogs, or exit the current temporary mode."
    })
  }),
  'previewUpload': Object["freeze"]({
    'upload': "Upload",
    'uploading': 'Uploading',
    'selectSingleNode': "Select one node to receive the upload",
    'selectedNodeMissing': 'Selected\x20node\x20not\x20found',
    'unsupportedNode': "The current node does not support preview upload",
    'invalidFileType': "Upload {label} file",
    'uploadFailed': "Upload failed. Try again.",
    'types': Object['freeze']({
      'image': "image",
      'video': "video",
      'audio': 'audio'
    }),
    'success': Object["freeze"]({
      'image': "Uploaded image applied to the current node",
      'video': "Uploaded video applied to the current node",
      'audio': "Uploaded audio applied to the current node"
    })
  }),
  'previewUploadResult': Object["freeze"]({
    'missingLocalPath': "Invalid upload result: missing {kind} local path",
    'missingNodeId': 'Invalid\x20upload\x20result:\x20missing\x20node\x20ID',
    'kind': Object['freeze']({
      'media': 'media',
      'image': "image",
      'video': "video",
      'audio': "audio"
    })
  }),
  'textInputContextMenu': Object["freeze"]({
    'undo': "Undo",
    'cut': 'Cut',
    'copy': "Copy",
    'pasteText': "Paste text",
    'delete': "Delete",
    'selectAll': 'Select\x20all',
    'clipboardReadFailed': "Failed to read clipboard. Check permissions.",
    'clipboardWriteFailed': "Failed to write to clipboard. Check permissions.",
    'clipboardUnsupported': "This environment cannot read clipboard text",
    'clipboardEmpty': "Clipboard has no text to paste"
  }),
  'workspaceContextMenu': Object["freeze"]({
    'openProject': "Open project",
    'renameProject': 'Rename',
    'duplicateProject': "Duplicate project",
    'collectProject': "Collect project",
    'archiveProject': "Archive project",
    'unarchiveProject': 'Unarchive\x20project',
    'deleteProject': 'Delete\x20project',
    'switchVersion': 'Switch\x20to\x20this\x20version',
    'deleteVersion': "Delete version",
    'switchResult': "Switch to this result",
    'deleteResult': "Delete result",
    'selectClip': "Select clip",
    'deleteClip': 'Delete\x20clip',
    'viewAsset': "View asset",
    'viewLibraryAsset': "View library asset",
    'deleteAsset': "Delete asset",
    'openEpisode': "Open episode",
    'view': 'View',
    'delete': "Delete"
  }),
  'canvasNodeFlows': Object['freeze']({
    'media': Object["freeze"]({
      'image': "Image",
      'video': 'Video',
      'audio': 'Audio'
    }),
    'paste': Object["freeze"]({
      'nodeName': Object['freeze']({
        'image': "Pasted image",
        'video': "Pasted video",
        'audio': "Pasted audio",
        'text': "Pasted text"
      }),
      'filePasted': "File pasted to canvas",
      'filesPasted': "{count} files pasted to canvas",
      'mediaPasted': "{label} pasted to canvas",
      'textPasted': "Text pasted to canvas",
      'clipboardReadFailed': 'Failed\x20to\x20read\x20clipboard.\x20Copy\x20again\x20and\x20retry,\x20or\x20drag\x20the\x20file\x20onto\x20the\x20canvas.',
      'clipboardEmpty': 'Clipboard\x20has\x20no\x20pasteable\x20content'
    })
  }),
  'canvasScreenshot': Object["freeze"]({
    'unsupported': "Screenshot is not supported in this environment",
    'entryNotReady': "Screenshot entry is not ready",
    'captureFailed': "Screenshot failed. Try again later.",
    'confirmAria': "Confirm screenshot",
    'cancelAria': "Cancel screenshot",
    'areaTooSmall': 'Screenshot\x20area\x20is\x20too\x20small',
    'nodeName': "Screenshot image",
    'added': 'Screenshot\x20added\x20to\x20canvas',
    'addFailed': "Failed to add screenshot",
    'hints': Object["freeze"]({
      'selectArea': "Drag to select a screenshot area. Esc cancels.",
      'adjustArea': "Drag to move, pull corners to resize"
    })
  }),
  'generationHistoryFileManager': Object["freeze"]({
    'panel': Object["freeze"]({
      'ariaLabel': "File manager",
      'title': 'File\x20Manager',
      'sourceTabsAria': "File source",
      'filtersAria': "File type filter",
      'orderAria': "Sort order"
    }),
    'filters': Object['freeze']({
      'all': "All",
      'image': 'Images',
      'video': "Videos",
      'audio': "Audio"
    }),
    'sources': Object["freeze"]({
      'currentCanvas': "Current canvas",
      'history': "History",
      'output': "Output folder"
    }),
    'mediaKinds': Object["freeze"]({
      'image': "image",
      'video': 'video',
      'audio': "audio",
      'folder': "folder",
      'file': "file"
    }),
    'fallback': Object["freeze"]({
      'outputFile': 'Output\x20file',
      'folder': 'Folder',
      'file': "File"
    }),
    'contextMenu': Object["freeze"]({
      'addToCanvas': "Add to canvas",
      'addManyToCanvas': "Add {count} to canvas",
      'fullscreen': 'Fullscreen\x20preview',
      'reveal': 'Show\x20in\x20Explorer',
      'delete': "Delete",
      'deleteMany': 'Delete\x20{count}'
    }),
    'loading': Object["freeze"]({
      'initial': "Loading...",
      'more': 'Loading\x20more...'
    }),
    'empty': Object['freeze']({
      'output': 'No\x20displayable\x20files\x20in\x20the\x20output\x20folder',
      'currentCanvas': "No generated results on the current canvas",
      'history': "No generated media history",
      'filtered': "No {label} yet"
    }),
    'sort': Object["freeze"]({
      'ascAria': "Currently ascending. Click to switch to descending.",
      'descAria': "Currently descending. Click to switch to ascending.",
      'ascTitle': "Ascending",
      'descTitle': "Descending"
    }),
    'subtitle': Object["freeze"]({
      'output': 'Browsing\x20the\x20output\x20folder',
      'currentCanvas': "Generated media on the current canvas",
      'history': "Generated media in the current project"
    }),
    'breadcrumbs': Object['freeze']({
      'up': "Up one level"
    }),
    'alt': Object["freeze"]({
      'videoHistory': "Video history",
      'imageHistory': "Image history"
    }),
    'toasts': Object["freeze"]({
      'addedMany': '{count}\x20files\x20added\x20to\x20canvas',
      'addedOutput': 'File\x20added\x20to\x20canvas',
      'addedHistory': "Historical {label} added to canvas",
      'revealFailed': "Failed to show in Explorer",
      'deletedMany': "Files deleted",
      'deletedOne': "Deleted",
      'deleteFailed': "Delete failed"
    }),
    'deleteConfirm': Object["freeze"]({
      'ariaLabel': "Delete file confirmation",
      'title': "Delete file?",
      'messageOne': 'Delete\x20this\x20file?',
      'messageMany': 'Delete\x20{count}\x20files?',
      'cancel': "Cancel",
      'delete': "Delete"
    })
  }),
  'generationHistory': Object["freeze"]({
    'fileFallback': Object["freeze"]({
      'image': "Image history {date}",
      'video': "Video history {date}",
      'audio': "Audio history {date}"
    }),
    'assetName': Object["freeze"]({
      'image': "Image {date}",
      'video': "Video {date}",
      'audio': 'Audio\x20{date}'
    })
  }),
  'whiteboardNode': Object["freeze"]({
    'background': Object["freeze"]({
      'upload': "Upload",
      'imageOnly': 'Whiteboard\x20backgrounds\x20must\x20be\x20image\x20files',
      'uploadSuccess': 'Background\x20image\x20connected\x20to\x20the\x20whiteboard',
      'uploadFailed': "Failed to upload background image"
    }),
    'style': Object["freeze"]({
      'lineType': 'Line',
      'arrowheads': 'Arrowheads',
      'colors': Object['freeze']({
        'black': "Black",
        'gray': "Gray",
        'pink': "Pink",
        'purple': "Purple",
        'blue': "Blue",
        'indigo': 'Indigo',
        'cyan': 'Cyan',
        'red': 'Red',
        'orange': "Orange",
        'yellow': "Yellow",
        'green': 'Green',
        'white': "White"
      }),
      'sizes': Object["freeze"]({
        'small': "Small",
        'medium': 'Medium',
        'large': "Large",
        'extraLarge': "Extra large"
      }),
      'fill': Object["freeze"]({
        'none': "No fill",
        'solid': 'Solid\x20fill'
      }),
      'dash': Object["freeze"]({
        'solid': "Solid",
        'dashed': "Dashed",
        'dotted': "Dotted"
      }),
      'font': Object["freeze"]({
        'sans': "Sans",
        'serif': "Serif",
        'mono': "Mono"
      }),
      'arrowKind': Object["freeze"]({
        'straight': "Straight",
        'arc': "Arc",
        'elbow': "Elbow"
      }),
      'terminal': Object["freeze"]({
        'start': "Start terminal",
        'end': 'End\x20terminal'
      }),
      'arrowhead': Object["freeze"]({
        'none': 'No\x20arrowhead',
        'arrow': 'Arrow',
        'triangle': "Triangle",
        'square': "Square terminal",
        'circle': 'Circle\x20terminal',
        'diamond': "Diamond terminal",
        'inverted': "Inverted triangle",
        'bar': "Bar terminal"
      })
    })
  }),
  'storyboard3d': Object["freeze"]({
    'defaults': Object['freeze']({
      'projectName': 'Untitled\x203D\x20Storyboard',
      'sceneName': "Scene 1",
      'shotName': "Shot 1"
    }),
    'saveStatus': Object["freeze"]({
      'saved': "Saved",
      'saving': "Saving",
      'error': "Save failed"
    }),
    'editor': Object["freeze"]({
      'ariaLabel': "3D storyboard editor",
      'projectName': "Module name",
      'modeAria': "Editor mode",
      'editMode': "Edit",
      'exploreMode': 'Explore\x20shots',
      'newProject': "New",
      'importProject': "Import JSON",
      'exportProject': "Export JSON",
      'save': "Save",
      'close': "Close 3D storyboard editor",
      'inspector': 'Inspector',
      'closeInspector': 'Close\x20inspector',
      'project': "Project",
      'scenes': "Scenes",
      'activeScene': "Active scene",
      'outline': "Scene outline",
      'assets': 'Assets',
      'assetsPending': "The model asset library will be connected during the import phase.",
      'viewport': "3D viewport",
      'tools': "Transform tools",
      'stageOneKicker': "Phase 1 · Module shell",
      'viewportPendingTitle': 'Independent\x20WebGL\x20viewport\x20mount\x20is\x20ready',
      'viewportPendingDescription': "This vertical slice validates the parent node, project state, independent workspace, and persistence boundary. Selection, transforms, and live 3D rendering arrive in the base editor phase.",
      'reuseDirectorBridge': "The existing PanoramaScene3DBridge will be reused instead of duplicating the renderer",
      'miniMap': 'Mini\x20Map',
      'shots': "Shots",
      'addShot': "Add camera",
      'addShotDescription': 'Create\x20a\x20shot\x20from\x20the\x20current\x20view\x20and\x20bind\x20a\x20movable\x20camera',
      'cameraTimeline': "Camera timeline",
      'context': "Context",
      'currentScene': 'Current\x20scene',
      'environment': "Environment",
      'grid': "Grid",
      'objects': "Objects",
      'enabled': 'On',
      'disabled': 'Off',
      'selection': 'Selection',
      'noSelection': "No object selected",
      'noSelectionDescription': "After the live 3D viewport is connected, this panel will switch between characters, props, cameras, and lights.",
      'aiAssistant': "AI assistant",
      'aiPending': 'Structured\x20commands,\x20transaction\x20validation,\x20and\x20voice\x20reuse\x20will\x20follow\x20a\x20stable\x20command\x20system.',
      'sceneMeta': "{shots} shots · {objects} objects",
      'emptyOutlineTitle': "No objects in this scene",
      'emptyOutlineDescription': "Built-in objects and synchronized 3D selection will be connected in phase 2.",
      'hidden': 'Hidden',
      'visible': "Visible",
      'previewPending': "Preview pending",
      'shotNumber': "Shot {index}",
      'stage2Hint': "The base 3D editor will be connected in phase 2",
      'stage3Hint': "Scene mutations unlock after the command system is connected",
      'stage4': "Phase 4",
      'stage4Hint': "Camera and shot management unlock in phase 4",
      'stage5': 'Phase\x205',
      'stage8': 'Phase\x208',
      'stage8Hint': "Mini Map and image backgrounds unlock in phase 8",
      'stage9Hint': 'Shot\x20exploration\x20unlocks\x20in\x20phase\x209',
      'stage10': 'Phase\x2010',
      'savedMessage': "The project snapshot was written back to the parent canvas node.",
      'newProjectConfirm': 'Creating\x20a\x20new\x20project\x20replaces\x20this\x20module\x20snapshot.\x20Continue?',
      'importSucceeded': "Project JSON imported and written back to the parent node.",
      'importFailed': 'Project\x20import\x20failed:\x20{error}',
      'exportUnavailable': "This runtime does not support browser file export.",
      'exportSucceeded': 'Project\x20JSON\x20exported.'
    }),
    'errors': Object['freeze']({
      'renderShotPending': "Single-shot rendering unlocks after the live 3D viewport is connected in phases 2/4.",
      'storyboardExportPending': "Storyboard export unlocks in phase 6."
    })
  }),
  'nodeCreation': Object["freeze"]({
    'sections': Object['freeze']({
      'generation': "Generation nodes",
      'source': "Source nodes",
      'function': "Utility nodes"
    }),
    'upload': Object['freeze']({
      'label': 'Upload\x20file',
      'subtitle': "Images, videos, audio"
    }),
    'items': Object["freeze"]({
      'aiText': Object["freeze"]({
        'label': "Text",
        'defaultName': "Text",
        'subtitle': "Copy, scripts, prompts"
      }),
      'aiImage': Object['freeze']({
        'label': 'Image',
        'defaultName': "Image",
        'subtitle': 'Images,\x20posters,\x20character\x20assets'
      }),
      'aiVideo': Object["freeze"]({
        'label': "Video",
        'defaultName': "Video",
        'subtitle': 'Short\x20films,\x20transitions,\x20motion\x20shots'
      }),
      'aiAudio': Object["freeze"]({
        'label': 'Audio',
        'defaultName': 'Audio',
        'subtitle': "Voiceover, sound effects, music"
      }),
      'sourceText': Object["freeze"]({
        'label': 'Source\x20text',
        'defaultName': "Source text",
        'subtitle': 'Copy,\x20scripts,\x20prompt\x20input'
      }),
      'sourceImage': Object["freeze"]({
        'label': "Source image",
        'defaultName': "Source image",
        'subtitle': "References, first frames, assets"
      }),
      'sourceVideo': Object['freeze']({
        'label': "Source video",
        'defaultName': "Source video",
        'subtitle': 'References,\x20clips,\x20video\x20input'
      }),
      'sourceAudio': Object['freeze']({
        'label': "Source audio",
        'defaultName': "Source audio",
        'subtitle': "Voiceover, music, sound references"
      }),
      'commentNote': Object["freeze"]({
        'label': "Comment",
        'defaultName': '',
        'subtitle': "Notes, annotations, todos"
      }),
      'webPreview': Object["freeze"]({
        'label': "Browser",
        'defaultName': "Browser",
        'subtitle': "Enter a URL and browse inside the canvas"
      }),
      'panoramaScene': Object["freeze"]({
        'label': '3D\x20Stage',
        'defaultName': "3D Stage",
        'subtitle': '3D\x20scenes,\x20characters,\x20cameras'
      }),
      'panorama360': Object["freeze"]({
        'label': "360 Panorama",
        'defaultName': '360\x20Panorama',
        'subtitle': "Panoramas and spatial relationships"
      }),
      'storyboard': Object["freeze"]({
        'label': "Grid image",
        'defaultName': "Grid image",
        'subtitle': 'Blank\x203x3\x20image\x20grid'
      }),
      'storyboardScript': Object["freeze"]({
        'label': "Storyboard",
        'defaultName': "Storyboard",
        'subtitle': "Shot lists, prompts, pacing"
      }),
      'collage': Object["freeze"]({
        'label': 'Collage',
        'defaultName': "Collage",
        'subtitle': "Image layout and export"
      }),
      'whiteboard': Object["freeze"]({
        'label': 'Whiteboard',
        'defaultName': "Whiteboard",
        'subtitle': "Sketches, annotations, text notes"
      }),
      'mediaClip': Object["freeze"]({
        'label': "Clip",
        'defaultName': "Clip",
        'subtitle': "Audio/video trimming and organization"
      }),
      'debug': Object["freeze"]({
        'label': "Debug node",
        'defaultName': "Debug node",
        'subtitle': "Inspect payloads and task state"
      })
    })
  })
});
export default enUS;