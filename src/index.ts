import fs from 'fs';
import CartService from './services/CartService';

// Function to read commands from the input file
function readCommandsFromFile(filePath: string): any[] {
    const cwdPath = process.cwd();
    const data = fs.readFileSync(cwdPath + filePath, 'utf-8');
    return JSON.parse(data);
}

// Function to write results to the output file
function writeResultsToFile(filePath: string, results: any[]): void {
    const cwdPath = process.cwd();
    const data = JSON.stringify(results, null, 2);
    fs.writeFileSync(cwdPath + filePath, data, 'utf-8');
}

// Main function to process commands and execute on the cart service
function processCommands(inputFilePath: string, outputFilePath: string): void {
    let commands = readCommandsFromFile(inputFilePath);
    const cartService = new CartService();
    const results: any[] = [];

    commands.forEach((commandObj: any) => {
        const {command, payload} = commandObj;
        try {
            switch (command) {
                case 'addItem':
                    cartService.addItem(payload);
                    results.push({command, result: true, message: `Item with itemId ${payload.itemId} added!`});
                    break;
                case 'addVasItemToItem':
                    cartService.addVasItem(payload);
                    results.push({command, result: true, message: `Vas item with itemId ${payload.itemId} added!`});
                    break;
                case 'removeItem':
                    cartService.removeItem(payload.itemId);
                    results.push({command, result: true, message: `Item with itemId ${payload.itemId} removed!`});
                    break;
                case 'resetCart':
                    cartService.reset();
                    results.push({command, result: true, message: 'Cart reset!'});
                    break;
                case 'displayCart':
                    const cartContent = cartService.getCartContent();
                    results.push({command, result: true, message: cartContent});
                    break;
                default:
                    results.push({command, result: false, message: 'Invalid command'});
            }
        } catch (err) {
            results.push({command, result: false, message: err.message});
        }

    });
    writeResultsToFile(outputFilePath, results);
}

const inputFilePath = '/input.json';
const outputFilePath = '/output.json';

try {
    processCommands(inputFilePath, outputFilePath);
    console.log('Output file generated successfully!');
} catch (err) {
    console.error(err);
}




