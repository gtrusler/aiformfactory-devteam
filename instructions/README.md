# Project Documentation Guide

## Initial Setup
### Prerequisites
```bash
# 1. Ensure conda is activated with the correct environment
conda activate aiformfactory-env

# If environment doesn't exist:
conda create -n aiformfactory-env python=3.11
conda activate aiformfactory-env
```

## Documentation Files
### 📄 PROJECT.md
**Purpose**: High-level project overview and current state
**When to Update**: New features, tech stack changes, team changes

### 📝 CHANGELOG.md
**Purpose**: Track all notable changes
**When to Update**: Features, fixes, breaking changes

### 🎓 LEARNINGS.md
**Purpose**: Technical insights and current status
**When to Update**: Start/end of work, solving problems, discovering patterns

### 🏗 ARCHITECTURE.md
**Purpose**: System design and technical architecture
**When to Update**: Design changes, new components, schema updates

### 👥 CONTRIBUTING.md
**Purpose**: Guide for new contributors
**When to Update**: Setup changes, process updates

## Documentation Workflow
### 1. Starting Work
- Review current status in LEARNINGS.md
- Check for pending tasks
- Verify conda environment

### 2. During Development
- Update CHANGELOG.md for changes
- Document solutions in LEARNINGS.md
- Update architecture for design changes

### 3. Before Ending Work
- Update current status
- Document blocking issues
- List next steps
- Update testing status
