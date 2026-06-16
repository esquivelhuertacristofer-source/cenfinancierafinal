gdjs.MenuInicioCode = {};
gdjs.MenuInicioCode.localVariables = [];
gdjs.MenuInicioCode.idToCallbackMap = new Map();
gdjs.MenuInicioCode.GDNewSpriteObjects1= [];
gdjs.MenuInicioCode.GDNewSpriteObjects2= [];
gdjs.MenuInicioCode.GDBoton_9595jugarObjects1= [];
gdjs.MenuInicioCode.GDBoton_9595jugarObjects2= [];


gdjs.MenuInicioCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.wasKeyJustPressed(runtimeScene, "Space");
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game Scene", false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.wasKeyJustPressed(runtimeScene, "Return");
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game Scene", false);
}
}

}


};

gdjs.MenuInicioCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.MenuInicioCode.GDNewSpriteObjects1.length = 0;
gdjs.MenuInicioCode.GDNewSpriteObjects2.length = 0;
gdjs.MenuInicioCode.GDBoton_9595jugarObjects1.length = 0;
gdjs.MenuInicioCode.GDBoton_9595jugarObjects2.length = 0;

gdjs.MenuInicioCode.eventsList0(runtimeScene);
gdjs.MenuInicioCode.GDNewSpriteObjects1.length = 0;
gdjs.MenuInicioCode.GDNewSpriteObjects2.length = 0;
gdjs.MenuInicioCode.GDBoton_9595jugarObjects1.length = 0;
gdjs.MenuInicioCode.GDBoton_9595jugarObjects2.length = 0;


return;

}

gdjs['MenuInicioCode'] = gdjs.MenuInicioCode;
