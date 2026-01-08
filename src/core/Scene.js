
const sceneMacros =
{
    SCENE_MAIN_SCENE: 1,
    SCENE_ENDCREDITS: 2,
};

const scenes = [
    { text: 'All Scenes', value: sceneMacros.SCENE_MAIN_SCENE },
    { text: 'End Credits', value: sceneMacros.SCENE_ENDCREDITS },
];
const START_TIME =
{ 
    // Add music details per beat
    SCENE_INRTO_SCENE: 0.0,                 // from AMC frame to stairs
    SCENE_BACK_AND_FORTH_SUNSET: 26.0,      // stairs to sun and back to stairs, scenery
    SCENE_LIVING_ROOM_DRINKING: 42.0,       // Night drinking scene
    
    SCENE_PIANO: 60.0,                      // Night Piano Scene
    SCENE_KITCHEN : 75.0,                   // Kitchen Scene
    SCENE_ATTIC_SCENE : 90.0,               // Watching stars from Attic
    SCENE_BEDROOM_SCENE : 115.0,            // Jugnu and bedroom scene
    SCENE_BRIDGE_SCENE : 130.0,             // Final Bridge scene
       
    SCENE_END_CREDITS: 300.0,       // Credit role : 5:34 instrumental starts for Credits
    
    // SCENE_END_MESSAGE: 200.0        // The End - message
    
};
