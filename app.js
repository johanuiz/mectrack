#!/usr/bin/env node

/**
 * MecTrack - Passenger/DreamHost Entry Point
 * This file is used by Passenger to start the application
 * It exports the Express app for Passenger to use
 */

// Load the main server application
const app = require('./server.js');

// Export for Passenger
module.exports = app;

