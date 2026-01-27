const fs = require('fs');
const path = require('path');
const translate = require('translate-google');

/**
 * Recursively translate all string values in an object or array
 */
async function translateObject(obj, targetLang, currentPath = '') {
    const isArray = Array.isArray(obj);
    const result = isArray ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;

        if (typeof value === 'string') {
            // Translate string values
            console.log(`Translating [${targetLang}]: ${fullPath}`);
            try {
                const translatedValue = await translate(value, { to: targetLang });
                if (isArray) {
                    result.push(translatedValue);
                } else {
                    result[key] = translatedValue;
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`  ⚠️  Error: ${error.message} - keeping original`);
                if (isArray) {
                    result.push(value);
                } else {
                    result[key] = value;
                }
            }
        } else if (typeof value === 'object' && value !== null) {
            // Recursively translate nested objects/arrays
            const translatedValue = await translateObject(value, targetLang, fullPath);
            if (isArray) {
                result.push(translatedValue);
            } else {
                result[key] = translatedValue;
            }
        } else {
            // Keep other types as-is (numbers, booleans, null)
            if (isArray) {
                result.push(value);
            } else {
                result[key] = value;
            }
        }
    }

    return result;
}

/**
 * Main translation function
 */
async function translateFile(sourcePath, targetLang) {
    console.log(`\n🌍 Starting translation to ${targetLang.toUpperCase()}...`);

    // Read source file
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

    // Translate
    const translatedData = await translateObject(sourceData, targetLang);

    // Write to target file
    const localesDir = path.dirname(sourcePath);
    const targetDir = path.join(path.dirname(localesDir), targetLang);
    const targetPath = path.join(targetDir, 'translation.json');

    // Create directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write file with pretty formatting
    fs.writeFileSync(targetPath, JSON.stringify(translatedData, null, 4), 'utf-8');

    console.log(`✅ Translation complete: ${targetPath}`);
}

/**
 * Run translations
 */
async function main() {
    const sourcePath = path.join(__dirname, '../public/locales/fr/translation.json');

    const targetLangs = [
        { code: 'pt', name: 'Portuguese' },
        { code: 'it', name: 'Italian' },
        { code: 'es', name: 'Spanish' },
        { code: 'de', name: 'German' }
    ];

    console.log('🚀 INVIK Bank Translation Tool');
    console.log('================================');
    console.log(`Source: ${sourcePath}`);
    console.log(`Target languages: ${targetLangs.map(l => l.name).join(', ')}`);
    console.log('\n⏳ This will take approximately 20-30 minutes...\n');

    for (const lang of targetLangs) {
        const startTime = Date.now();

        try {
            await translateFile(sourcePath, lang.code);

            const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
            console.log(`⏱️  Duration: ${duration} minutes\n`);
        } catch (error) {
            console.error(`❌ Error translating to ${lang.name}:`, error);
        }
    }

    console.log('\n✨ All translations complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated files in public/locales/');
    console.log('2. Update critical banking terms manually');
    console.log('3. Update i18n.js to include new languages');
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { translateFile, translateObject };
