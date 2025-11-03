const fs = require('fs');
const path = require('path');

function isExternalUrl(url) {
	// considera externo se começar com http(s):// ou // (CDN)
	return !url || /^https?:\/\//i.test(url) || /^\/\//.test(url);
}

function stripQueryAndHash(url) {
	if (!url) return url;
	return url.split('?')[0].split('#')[0];
}

/**
 * Remove um arquivo dentro de /public quando o banco guarda um caminho relativo tipo "/images/post/arquivo.jpg"
 * Retorna true se arquivo foi removido, false caso não exista ou url externa.
 */
function deletePublicFile(fileUrl) {
	try {
		if (!fileUrl) return false;
		const clean = stripQueryAndHash(fileUrl);
		// Ignora URLs externas
		if (isExternalUrl(clean) && !clean.startsWith('/')) return false;
		// Remove barra inicial
		const relative = clean.replace(/^\/+/, '');
		const fullPath = path.join(__dirname, '..', 'public', relative);
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath);
			return true;
		}
		return false;
	} catch (err) {
		// não quebra a aplicação se algo falhar, só loga
		console.warn('[fileCleaner] Erro ao remover arquivo:', err && err.message ? err.message : err);
		return false;
	}
}

module.exports = {
	deletePublicFile
};
