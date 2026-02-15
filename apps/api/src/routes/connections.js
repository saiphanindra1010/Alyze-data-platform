import express from "express";
import mongoose from "mongoose";
import { validateCSRFToken } from '../middlewares/csrfMiddleware.js';

const router = express.Router();

/**
 * @route   GET /connections
 * @desc    Get all connections for authenticated user
 * @access  Private
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("connections");

    // Filter connections by user
    const connections = await collection.find({
      userId: userId.toString()
    }).toArray();

    return res.json({
      success: true,
      data: connections
    });
  } catch (err) {
    console.error('Connections fetch error:', err);
    res.status(500).json({
      error: "Failed to fetch connections",
      code: 'CONNECTIONS_FETCH_ERROR'
    });
  }
});

/**
 * @route   POST /connections
 * @desc    Create a new connection
 * @access  Private (CSRF protected)
 */
router.post("/", validateCSRFToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const { name, type, config } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Connection name is required',
        code: 'NAME_REQUIRED'
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("connections");

    const result = await collection.insertOne({
      userId: userId.toString(),
      name,
      type: type || 'default',
      config: config || {},
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      connectionId: result.insertedId
    });
  } catch (err) {
    console.error('Connection create error:', err);
    res.status(500).json({
      error: "Failed to create connection",
      code: 'CONNECTION_CREATE_ERROR'
    });
  }
});

/**
 * @route   PUT /connections/:id
 * @desc    Update a connection
 * @access  Private (CSRF protected)
 */
router.put("/:id", validateCSRFToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const connectionId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const { name, type, config } = req.body;

    const db = mongoose.connection.db;
    const collection = db.collection("connections");

    // Ensure user owns this connection
    const result = await collection.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(connectionId),
        userId: userId.toString()
      },
      {
        $set: {
          ...(name && { name }),
          ...(type && { type }),
          ...(config && { config }),
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({
        error: 'Connection not found or access denied',
        code: 'CONNECTION_NOT_FOUND'
      });
    }

    return res.json({
      success: true,
      connection: result.value
    });
  } catch (err) {
    console.error('Connection update error:', err);
    res.status(500).json({
      error: "Failed to update connection",
      code: 'CONNECTION_UPDATE_ERROR'
    });
  }
});

/**
 * @route   DELETE /connections/:id
 * @desc    Delete a connection
 * @access  Private (CSRF protected)
 */
router.delete("/:id", validateCSRFToken, async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const connectionId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("connections");

    // Ensure user owns this connection
    const result = await collection.deleteOne({
      _id: new mongoose.Types.ObjectId(connectionId),
      userId: userId.toString()
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Connection not found or access denied',
        code: 'CONNECTION_NOT_FOUND'
      });
    }

    return res.json({
      success: true,
      message: 'Connection deleted'
    });
  } catch (err) {
    console.error('Connection delete error:', err);
    res.status(500).json({
      error: "Failed to delete connection",
      code: 'CONNECTION_DELETE_ERROR'
    });
  }
});

export default router;
