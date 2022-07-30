import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    readTime: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }],
    isPublic: {
        type: Boolean,
        required: true,
        default: false,
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const Blog = mongoose.model('blog', blogSchema);
export default Blog;