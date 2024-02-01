from flask import Flask, render_template, redirect, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask import render_template
from flask import jsonify


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobs.db'
db = SQLAlchemy(app)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_name = db.Column(db.String(255), nullable=False)
    deadline = db.Column(db.Integer, nullable=False)
    profit = db.Column(db.Integer, nullable=False)

def create_tables():
    with app.app_context():
        db.create_all()

@app.route('/')
def index():
    jobs = Job.query.all()
    return render_template('index.html', jobs=jobs)

@app.route('/sorted')
def sorted():
    return render_template('sorted.html')



@app.route('/add_job', methods=['POST'])
def add_job():
    try:
        job_name = request.form['job_name']
        deadline = int(request.form['deadline'])
        profit = int(request.form['profit'])

        if not job_name or deadline <= 0 or profit < 0:
            raise ValueError("Invalid form data")

        new_job = Job(job_name=job_name, deadline=deadline, profit=profit)
        db.session.add(new_job)
        db.session.commit()

        return redirect(url_for('index'))

    except ValueError as e:
        return render_template('error.html', error=str(e))

    except Exception as e:
        return render_template('error.html', error="An error occurred")
    
@app.route('/delete_job', methods=['POST'])
def delete_job():
    try:
        job_id = int(request.form['delete_index'])

        job_to_delete = Job.query.get(job_id)

        if job_to_delete:
            db.session.delete(job_to_delete)
            db.session.commit()

        return redirect(url_for('index'))

    except Exception as e:
        return render_template('error.html', error="An error occurred")



@app.route('/sort')
def sort():
    try:
        jobs = Job.query.all()
        original_indices = list(range(1, len(jobs)+1))  # Original indices starting from 1
        deadlines = [job.deadline for job in jobs]
        profits = [job.profit for job in jobs]

        sorted_schedule = greedyJobScheduling(jobs, original_indices, deadlines, profits)

        # Remove empty slots from the sorted schedule
        sorted_schedule = [job for job in sorted_schedule if job != '-']

        return render_template('index.html', sorted_jobs=sorted_schedule, jobs=jobs, original_indices=original_indices)

    except Exception as e:
        return render_template('error.html', error="An error occurred during sorting: " + str(e))


def fcfsScheduling(jobs):
    # Sort jobs by their original order of arrival using a loop
    for i in range(len(jobs)):
        for j in range(0, len(jobs) - i - 1):
            if jobs[j].id > jobs[j + 1].id:
                # Swap jobs if they are out of order
                jobs[j], jobs[j + 1] = jobs[j + 1], jobs[j]

    return jobs

# ... (rest of the code)

@app.route('/fcfs', methods=['GET', 'POST'])
def fcfs():
    try:
        jobs = Job.query.all()
        original_indices = list(range(1, len(jobs) + 1))

        # Sort jobs using FCFS
        sorted_schedule = fcfsScheduling(jobs)

        return render_template('index.html', sorted_jobs=sorted_schedule, jobs=jobs, original_indices=original_indices)

    except Exception as e:
        return render_template('error.html', error="An error occurred during sorting: " + str(e))




if __name__ == '__main__':
    create_tables()
    app.run(debug=True)