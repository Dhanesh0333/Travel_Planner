import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTripSchema, dayPlanSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route("/api");
  
  // Destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });
  
  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid destination ID" });
      }
      
      const destination = await storage.getDestination(id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });
  
  app.get("/api/destinations/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const destinations = await storage.searchDestinations(query);
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search destinations" });
    }
  });
  
  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const destinationId = req.query.destinationId as string;
      
      let activities;
      if (destinationId) {
        const id = parseInt(destinationId);
        if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid destination ID" });
        }
        activities = await storage.getActivitiesByDestination(id);
      } else {
        activities = await storage.getAllActivities();
      }
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  
  app.get("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid activity ID" });
      }
      
      const activity = await storage.getActivity(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });
  
  // Trips
  app.get("/api/trips", async (req, res) => {
    try {
      const trips = await storage.getAllTrips();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });
  
  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });
  
  app.post("/api/trips", async (req, res) => {
    try {
      const validationResult = insertTripSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid trip data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Validate itinerary structure separately for more detailed error messages
      const itineraryValidation = z.array(dayPlanSchema).safeParse(req.body.itinerary);
      if (!itineraryValidation.success) {
        return res.status(400).json({ 
          message: "Invalid itinerary data", 
          errors: itineraryValidation.error.errors 
        });
      }
      
      const trip = await storage.createTrip(validationResult.data);
      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to create trip" });
    }
  });
  
  app.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      
      // Partial validation for update
      const validationResult = insertTripSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid trip data", 
          errors: validationResult.error.errors 
        });
      }
      
      // If itinerary is provided, validate its structure
      if (req.body.itinerary) {
        const itineraryValidation = z.array(dayPlanSchema).safeParse(req.body.itinerary);
        if (!itineraryValidation.success) {
          return res.status(400).json({ 
            message: "Invalid itinerary data", 
            errors: itineraryValidation.error.errors 
          });
        }
      }
      
      const updatedTrip = await storage.updateTrip(id, validationResult.data);
      
      if (!updatedTrip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(updatedTrip);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trip" });
    }
  });
  
  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      
      const success = await storage.deleteTrip(id);
      
      if (!success) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}