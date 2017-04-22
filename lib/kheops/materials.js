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