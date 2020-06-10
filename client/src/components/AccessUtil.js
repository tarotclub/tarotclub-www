
/**
 * -1 = compte désactivé
 * 0 = compte non validé
 * 1 = exploitant
 * 2 = maintenance
 * 100 = admin 
 */

function levelToName(level) {
    if (level === 0) {
        return "Non validé";
    } else if (level === 1) {
        return "Exploitant";
    } else if (level === 2) {
        return "Maintenance";
    } else if (level >= 100) {
        return "Administrateur";
    } else if (level === -1) {
        return "Compte désactivé";
    } else {
        return "Niveau inconnu";
    }
}

export default  {
    levelToName
}
