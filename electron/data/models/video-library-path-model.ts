import { Instance, STRING } from "sequelize";
import sequelize from "../database-connection";
import VideoLibrary from "./video-library-model";

export interface VideoLibraryPathAttributes {
    path: string
}

export type VideoLibraryPathInstance = Instance<VideoLibraryPathAttributes> & VideoLibraryPathAttributes;

const VideoLibraryPath = sequelize.define<VideoLibraryPathInstance, VideoLibraryPathAttributes>('videolibrarypath', {
    path: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

VideoLibrary.hasMany(VideoLibraryPath, { as: 'paths', foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

export default VideoLibraryPath;