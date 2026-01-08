
var ModelsMap = [];
if (START_E2E_DEMO === true) {
    ModelsMap = [

        // ALL SCENE_MAIN_SCENE Models
        { name: "canvas", files: ['assets/models/Canvas/Canvas.gltf', 'assets/models/Canvas/Canvas.bin'] },
        { name: "palm_tree", files: ['assets/models/world/palm_tree/Untitled.gltf', 'assets/models/world/palm_tree/Untitled.bin'] },
        { name: "dongar_tree", files: ['assets/models/world/DongarTrree_models/tree.gltf', 'assets/models/world/DongarTrree_models/tree.bin'] },
        { name: "mango_tree", files: ['assets/models/world/mango_tree/mango_tree.gltf', 'assets/models/world/mango_tree/mango_tree.bin'] },
        { name: "orange_tree", files: ['assets/models/world/orangeTree/scene.gltf', 'assets/models/world/orangeTree/scene.bin'] },
        { name: "gulmohor_tree", files: ['assets/models/world/gulmohorTree/scene.gltf', 'assets/models/world/gulmohorTree/scene.bin'] },
        { name: "panKanis", files: ['assets/models/world/panKanis/scene.gltf', 'assets/models/world/panKanis/scene.bin'] },
        { name: "chapha_tree", files: ['assets/models/world/chapha_tree/scene.gltf', 'assets/models/world/chapha_tree/scene.bin'] },
        { name: "stones", files: ['assets/models/world/Stones/scene.gltf', 'assets/models/world/Stones/scene.bin'] },
        { name: "House_Six", files: ['assets/models/SupportHouse/HouseNo6/scene.gltf', 'assets/models/SupportHouse/HouseNo6/scene.bin'] },
        { name: "Old_hut", files: ['assets/models/SupportHouse/Old_hut/scene.gltf', 'assets/models/SupportHouse/Old_hut/scene.bin'] },
         { name: "tree", files: ['assets/models/world/tree/scene.gltf', 'assets/models/world/tree/scene.bin'] },
       
        { name: "projectName", files: ['assets/models/world/ProjectName/pName.gltf', 'assets/models/world/ProjectName/pName.bin'] },

        { name: "base", files: ['assets/models/world/base/base.obj', 'assets/models/world/base/base.mtl'] },
        { name: "bush", files: ['assets/models/world/bush/scene.gltf', 'assets/models/world/bush/scene.bin'] },
        { name: "grass", files: ['assets/models/world/grass/scene.gltf', 'assets/models/world/grass/scene.bin'] },
        { name: "nightTree", files: ['assets/models/world/nightTree/scene.gltf', 'assets/models/world/nightTree/scene.bin'] },
        { name: "animated_WhiteBird", files: ['assets/models/animated-bird/source/Bird_Asset.fbx'] },

        { name: "MainHouse", files: ['assets/models/MainHouse/MainHouse.gltf', 'assets/models/MainHouse/MainHouse.bin'] },
        { name: "Kitchen", files: ['assets/models/Kitchen/Kitchen.gltf', 'assets/models/Kitchen/Kitchen.bin'] },

        { name: "OutsideEvening_ManSittingModel", files: ['assets/models/Character/Man/OutsideEveningManSitting/ManSittingOutside.gltf', 'assets/models/Character/Man/OutsideEveningManSitting/ManSittingOutside.bin'] },
        
        { name: "LivingRoom_DrinkingScene_ManModels", files: ['assets/models/Character/Man/DrinkingMan/ManDrinking.gltf', 'assets/models/Character/Man/DrinkingMan/ManDrinking.bin'] },
        // "assets/models/Character/Couples/inLivingRoom/ManDrinking_Wife.gltf"
        { name: "LivingRoom_DrinkingScene_WomenModels", files: ['assets/models/Character/Women/DrinkingScene_Women/DrinkingScene_Women.gltf', 'assets/models/Character/Women/DrinkingScene_Women/DrinkingScene_Women.bin'] },

        { name: "LivingRoom_PianoSceneCoupleModel", files: ['assets/models/Character/Couples/OnPiano/CoupleOnPiano.gltf', 'assets/models/Character/Couples/OnPiano/CoupleOnPiano.bin'] },

        { name: "Outside_EveningScene_CoupleModel", files: ['assets/models/Character/Couples/SittingOutside/CoupleSitting.gltf', 'assets/models/Character/Couples/SittingOutside/CoupleSitting.bin'] },

        { name: "KitchenScene_WomenModel", files: ['assets/models/Character/Women/KitchenScene_Women/Kitchen.gltf', 'assets/models/Character/Women/KitchenScene_Women/Kitchen.bin'] },

        { name: "ManSittingUnderGulmohar", files: ['assets/models/Character/Man/SittingUnderGulmohar/ManSittingUnderGulmohar.gltf', 'assets/models/Character/Man/SittingUnderGulmohar/ManSittingUnderGulmohar.bin'] },

        { name: "BridgeScene_CoupleModel", files: ['assets/models/Character/Couples/OnBridgeScene/CoupleOnBridge.gltf', 'assets/models/Character/Couples/OnBridgeScene/CoupleOnBridge.bin'] },

        { name: "ManReflectionOnFBO", files: ['assets/models/Character/Man/ManReflectionInFBO/BridgeSceneManReflection.gltf', 'assets/models/Character/Man/ManReflectionInFBO/BridgeSceneManReflection.bin'] },
        
        { name: "SpotlightScene", files: ['assets/models/SpotlightScene/SpotlightScene.gltf', 'assets/models/SpotlightScene/SpotlightScene.bin'] },

        { name: "House_One", files: ['assets/models/SupportHouse/HouseNo1/House_One.gltf', 'assets/models/SupportHouse/HouseNo1/House_One.bin'] },
        { name: "House_Five", files: ['assets/models/SupportHouse/HouseNo5/House_Five.gltf', 'assets/models/SupportHouse/HouseNo5/House_Five.bin'] },
        { name: "wooden_bridge", files: ['assets/models/Bridge_scene/scene.gltf', 'assets/models/Bridge_scene/scene.bin'] },

        { name: "bedroom", files: ['assets/models/bedroom/gltf/Bedroom.gltf', 'assets/models/bedroom/gltf/Bedroom.bin'] },
        { name: "Lotus", files: ['assets/models/Lotus/scene.gltf', 'assets/models/Lotus/scene.bin'] },

        { name: "Attic", files: ['assets/models/Lab_scene/lab/labScene.gltf', 'assets/models/Lab_scene/lab/labScene.bin'] },

        // ALL SCENE_ENDCREDITS Models
        { name: "piano", files: ['assets/models/piano/gltf/piano.gltf', 'assets/models/piano/gltf/piano.bin'] },
        { name: "allModels", files: ['assets/models/Text/allModel.gltf', 'assets/models/Text/allModel.bin'] },
        //{ name: "developedBy", files: ['assets/models/Text/allModel.gltf', 'assets/models/Text/allModel.bin'] },
        // { name: "backgroundScore", files: ['assets/models/Text/backgroundScore.gltf', 'assets/models/Text/backgroundScore.bin'] },
        // { name: "SpecialThanks", files: ['assets/models/Text/specialThanks.gltf', 'assets/models/Text/specialThanks.bin'] },
        // { name: "OurInspiration", files: ['assets/models/Text/ourInspirationSir.gltf', 'assets/models/Text/ourInspirationSir.bin'] },
        // { name: "technology", files: ['assets/models/Text/technology.gltf', 'assets/models/Text/technology.bin'] },
        // { name: "theEnd", files: ['assets/models/Text/theEnd.gltf', 'assets/models/Text/theEnd.bin'] },

        { name: "logo", files: ['assets/models/Text/TextureLogo.gltf', 'assets/models/Text/TextureLogo.bin'] },

    ];
} else if (selectedScene === sceneMacros.SCENE_MAIN_SCENE) {

    if (bNightScene === false) {
        // DAY SCENE
        ModelsMap = [
            { name: "canvas", files: ['assets/models/Canvas/Canvas.gltf', 'assets/models/Canvas/Canvas.bin'] },
            { name: "palm_tree", files: ['assets/models/world/palm_tree/Untitled.gltf', 'assets/models/world/palm_tree/Untitled.bin'] },
            { name: "dongar_tree", files: ['assets/models/world/DongarTrree_models/tree.gltf', 'assets/models/world/DongarTrree_models/tree.bin'] },
            { name: "mango_tree", files: ['assets/models/world/mango_tree/mango_tree.gltf', 'assets/models/world/mango_tree/mango_tree.bin'] },
            { name: "orange_tree", files: ['assets/models/world/orangeTree/scene.gltf', 'assets/models/world/orangeTree/scene.bin'] },
            { name: "gulmohor_tree", files: ['assets/models/world/gulmohorTree/scene.gltf', 'assets/models/world/gulmohorTree/scene.bin'] },
            { name: "panKanis", files: ['assets/models/world/panKanis/scene.gltf', 'assets/models/world/panKanis/scene.bin'] },
            { name: "chapha_tree", files: ['assets/models/world/chapha_tree/scene.gltf', 'assets/models/world/chapha_tree/scene.bin'] },
            { name: "stones", files: ['assets/models/world/Stones/scene.gltf', 'assets/models/world/Stones/scene.bin'] },
            { name: "House_Six", files: ['assets/models/SupportHouse/HouseNo6/scene.gltf', 'assets/models/SupportHouse/HouseNo6/scene.bin'] },
            { name: "Old_hut", files: ['assets/models/SupportHouse/Old_hut/scene.gltf', 'assets/models/SupportHouse/Old_hut/scene.bin'] },
             { name: "tree", files: ['assets/models/world/tree/scene.gltf', 'assets/models/world/tree/scene.bin'] },
       

            { name: "projectName", files: ['assets/models/world/ProjectName/pName.gltf', 'assets/models/world/ProjectName/pName.bin'] },

            { name: "base", files: ['assets/models/world/base/base.obj', 'assets/models/world/base/base.mtl'] },
            { name: "bush", files: ['assets/models/world/bush/scene.gltf', 'assets/models/world/bush/scene.bin'] },
            { name: "grass", files: ['assets/models/world/grass/scene.gltf', 'assets/models/world/grass/scene.bin'] },
            { name: "nightTree", files: ['assets/models/world/nightTree/scene.gltf', 'assets/models/world/nightTree/scene.bin'] },
            { name: "animated_WhiteBird", files: ['assets/models/animated-bird/source/Bird_Asset.fbx'] },

            { name: "MainHouse", files: ['assets/models/MainHouse/MainHouse.gltf', 'assets/models/MainHouse/MainHouse.bin'] },
            { name: "Kitchen", files: ['assets/models/Kitchen/Kitchen.gltf', 'assets/models/Kitchen/Kitchen.bin'] },

            { name: "OutsideEvening_ManSittingModel", files: ['assets/models/Character/Man/OutsideEveningManSitting/ManSittingOutside.gltf', 'assets/models/Character/Man/OutsideEveningManSitting/ManSittingOutside.bin'] },

            { name: "LivingRoom_DrinkingScene_ManModels", files: ['assets/models/Character/Man/DrinkingMan/ManDrinking.gltf', 'assets/models/Character/Man/DrinkingMan/ManDrinking.bin'] },
            // "assets/models/Character/Couples/inLivingRoom/ManDrinking_Wife.gltf"
            { name: "LivingRoom_DrinkingScene_WomenModels", files: ['assets/models/Character/Women/DrinkingScene_Women/DrinkingScene_Women.gltf', 'assets/models/Character/Women/DrinkingScene_Women/DrinkingScene_Women.bin'] },

            { name: "LivingRoom_PianoSceneCoupleModel", files: ['assets/models/Character/Couples/OnPiano/CoupleOnPiano.gltf', 'assets/models/Character/Couples/OnPiano/CoupleOnPiano.bin'] },

            { name: "Outside_EveningScene_CoupleModel", files: ['assets/models/Character/Couples/SittingOutside/CoupleSitting.gltf', 'assets/models/Character/Couples/SittingOutside/CoupleSitting.bin'] },

            { name: "KitchenScene_WomenModel", files: ['assets/models/Character/Women/KitchenScene_Women/Kitchen.gltf', 'assets/models/Character/Women/KitchenScene_Women/Kitchen.bin'] },

            { name: "ManSittingUnderGulmohar", files: ['assets/models/Character/Man/SittingUnderGulmohar/ManSittingUnderGulmohar.gltf', 'assets/models/Character/Man/SittingUnderGulmohar/ManSittingUnderGulmohar.bin'] },

            { name: "ManReflectionOnFBO", files: ['assets/models/Character/Man/ManReflectionInFBO/BridgeSceneManReflection.gltf', 'assets/models/Character/Man/ManReflectionInFBO/BridgeSceneManReflection.bin'] },

            { name: "BridgeScene_CoupleModel", files: ['assets/models/Character/Couples/OnBridgeScene/CoupleOnBridge.gltf', 'assets/models/Character/Couples/OnBridgeScene/CoupleOnBridge.bin'] },

            { name: "SpotlightScene", files: ['assets/models/SpotlightScene/SpotlightScene.gltf', 'assets/models/SpotlightScene/SpotlightScene.bin'] },

            { name: "House_One", files: ['assets/models/SupportHouse/HouseNo1/House_One.gltf', 'assets/models/SupportHouse/HouseNo1/House_One.bin'] },
            { name: "House_Five", files: ['assets/models/SupportHouse/HouseNo5/House_Five.gltf', 'assets/models/SupportHouse/HouseNo5/House_Five.bin'] },
            { name: "wooden_bridge", files: ['assets/models/Bridge_scene/scene.gltf', 'assets/models/Bridge_scene/scene.bin'] },

            { name: "bedroom", files: ['assets/models/bedroom/gltf/Bedroom.gltf', 'assets/models/bedroom/gltf/Bedroom.bin'] },
            { name: "Lotus", files: ['assets/models/Lotus/scene.gltf', 'assets/models/Lotus/scene.bin'] },

            { name: "Attic", files: ['assets/models/Lab_scene/lab/labScene.gltf', 'assets/models/Lab_scene/lab/labScene.bin'] },


        ];
    } else {
        // NIGHT SCENE
        ModelsMap = [
            { name: "base", files: ['assets/models/world/base/base.obj', 'assets/models/world/base/base.mtl'] },

            { name: "palm_tree", files: ['assets/models/world/palm_tree/palm_tree.gltf', 'assets/models/world/palm_tree/palm_tree.bin'] },
            { name: "bedroom", files: ['assets/models/bedroom/gltf/Bedroom.gltf', 'assets/models/bedroom/gltf/Bedroom.bin'] },

            { name: "SpotlightScene", files: ['assets/models/SpotlightScene/SpotlightScene.gltf', 'assets/models/SpotlightScene/SpotlightScene.bin'] },
        ];
    }

} else if (selectedScene === sceneMacros.SCENE_ENDCREDITS) {
    ModelsMap = [
        { name: "piano", files: ['assets/models/piano/gltf/piano.gltf', 'assets/models/piano/gltf/piano.bin'] },

        { name: "allModels", files: ['assets/models/Text/allModel.gltf', 'assets/models/Text/allModel.bin'] },
        //{ name: "developedBy", files: ['assets/models/Text/allModel.gltf', 'assets/models/Text/allModel.bin'] },
        // { name: "backgroundScore", files: ['assets/models/Text/backgroundScore.gltf', 'assets/models/Text/backgroundScore.bin'] },
        // { name: "SpecialThanks", files: ['assets/models/Text/specialThanks.gltf', 'assets/models/Text/specialThanks.bin'] },
        // { name: "OurInspiration", files: ['assets/models/Text/ourInspirationSir.gltf', 'assets/models/Text/ourInspirationSir.bin'] },
        // { name: "technology", files: ['assets/models/Text/technology.gltf', 'assets/models/Text/technology.bin'] },
        // { name: "theEnd", files: ['assets/models/Text/theEnd.gltf', 'assets/models/Text/theEnd.bin'] },

    ];
}

var bDisplayModels = true;

assimpjs().then(function (ajs) {

    if (bDisplayModels) {
        Promise.all(ModelsMap.flatMap(o => o.files).map((fileToLoad) => fetch(fileToLoad))).then((responses) => {
            return Promise.all(responses.map((res) => res.arrayBuffer()))
        }).then((arrayBuffers) => {
            var k = 0
            for (var i = 0; i < ModelsMap.length; i++) {

                let fileList = new ajs.FileList();
                for (let j = 0; j < ModelsMap[i].files.length; j++) {
                    fileList.AddFile(ModelsMap[i].files[j], new Uint8Array(arrayBuffers[k++]));
                }

                let result = ajs.ConvertFileList(fileList, 'assjson')
                if (!result.IsSuccess() || result.FileCount() == 0) {
                    console.log(result.GetErrorCode());
                    return
                }

                let resultFile = result.GetFile(0);
                let jsonContent = new TextDecoder().decode(resultFile.GetContent());
                let resultJson = JSON.parse(jsonContent);

                // console.log(resultJson);
                ModelsMap[i].json = resultJson;
                ModelsMap[i].directory = ModelsMap[i].files[0].substring(0, ModelsMap[i].files[0].lastIndexOf('/'));
            }
            main();
        })
    }
    else {
        main();
    }
})
