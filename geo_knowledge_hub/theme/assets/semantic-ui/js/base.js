/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/*
Base dependencies for the GEO Knowledge Hub pages.
 */

/**
 * Geospatial dependencies.
 */

// Leaflet
import L from 'leaflet';

// Geocoding controller
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';

// Geometry editor
import '@geoman-io/leaflet-geoman-free';

// Fullscreen
import 'leaflet.fullscreen';

/**
 * Configurations
 */
L.Icon.Default.imagePath = '/static/icons/';
