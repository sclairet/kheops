/*
	this file is part of the Kheops framework
	MIT licence (see LICENCE.txt)
*/


var kh = kh || {};


kh.material = kh.material || {};


kh.material.getPreferedShaderKind = function getPreferedShaderKind( materialDesc) {
	if (('shininess' in materialDesc) && (materialDesc.shininess > 0.0))
		return kh.PER_FRAGMENT_SHADER;
	else
		return kh.PER_VERTEX_SHADER;
};


kh.material.duplicateMaterial = function duplicateMaterial(source) {
	var material = {
		'ambientLightWeight': ('ambientLightWeight' in source) ? source.ambientLightWeight : [0.2, 0.2, 0.2],
		'diffuseLightWeight': ('diffuseLightWeight' in source) ? source.diffuseLightWeight : [0.8, 0.8, 0.8],
		'specularLightWeight': ('specularLightWeight' in source) ? source.specularLightWeight : [1.0, 1.0, 1.0],
		'shininess': ('shininess' in source) ? source.shininess : 0.0,
		'transparency': ('transparency' in source) ? source.transparency : 1.0
	};
	return material;
};