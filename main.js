document.addEventListener('DOMContentLoaded', function () {
    const calendarContainer = document.getElementById('calendar');
    const sidebar = document.createElement('div');
    const noteForm = document.createElement('div');
    const noteText = document.createElement('textarea');
    const saveNoteButton = document.createElement('button');
    const cancelNoteButton = document.createElement('button');
    const clearNotesButton = document.createElement('button');
    const tooltip = document.createElement('div');
    
    let selectedDate = null;

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Lista de feriados nacionais no Brasil para 2024
    const holidays = [
        { date: new Date(2024, 0, 1), description: 'Ano Novo' }, // 1º de Janeiro
        { date: new Date(2024, 1, 12), description: 'Carnaval' }, // 12 de Fevereiro
        { date: new Date(2024, 3, 21), description: 'Tiradentes' }, // 21 de Abril
        { date: new Date(2024, 4, 1), description: 'Dia do Trabalho' }, // 1º de Maio
        { date: new Date(2024, 5, 30), description: 'São João' }, // 30 de Junho
        { date: new Date(2024, 6, 9), description: 'Dia da Independência' }, // 9 de Julho
        { date: new Date(2024, 7, 15), description: 'Assunção de Nossa Senhora' }, // 15 de Agosto
        { date: new Date(2024, 8, 7), description: 'Dia da Independência do Brasil' }, // 7 de Setembro
        { date: new Date(2024, 9, 12), description: 'Nossa Senhora Aparecida' }, // 12 de Outubro
        { date: new Date(2024, 10, 2), description: 'Finados' }, // 2 de Novembro
        { date: new Date(2024, 10, 15), description: 'Proclamação da República' }, // 15 de Novembro
        { date: new Date(2024, 11, 25), description: 'Natal' } // 25 de Dezembro
    ];
    
    const notes = JSON.parse(localStorage.getItem('notes')) || {};
    
    function createCalendar(year) {
        calendarContainer.innerHTML = '';
        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';
            
            const header = document.createElement('h2');
            header.textContent = `${months[month]} ${year}`;
            monthDiv.appendChild(header);
            
            const daysDiv = document.createElement('div');
            daysDiv.className = 'days';
            
            daysOfWeek.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day day-header';
                dayHeader.textContent = day;
                daysDiv.appendChild(dayHeader);
            });
            
            const firstDay = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();
            
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                daysDiv.appendChild(emptyDay);
            }
            
            for (let day = 1; day <= totalDays; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day';
                dayDiv.textContent = day;
                
                const currentDate = new Date(year, month, day);
                const dateString = currentDate.toISOString().split('T')[0];
                
                // Prepare tooltip content
                let tooltipContent = '';
                const holiday = holidays.find(h => h.date.getFullYear() === year && h.date.getMonth() === month && h.date.getDate() === day);
                if (holiday) {
                    dayDiv.classList.add('holiday'); // Add class for holiday styling
                    tooltipContent += `Feriado: ${holiday.description}\n`;
                }
                if (notes[dateString]) {
                    tooltipContent += `Observação: ${notes[dateString]}`;
                }
                
                dayDiv.addEventListener('mouseover', () => {
                    if (tooltipContent) {
                        tooltip.textContent = tooltipContent;
                        tooltip.style.display = 'block';
                        tooltip.style.left = `${dayDiv.getBoundingClientRect().left + window.scrollX}px`;
                        tooltip.style.top = `${dayDiv.getBoundingClientRect().bottom + window.scrollY}px`;
                    }
                });
                
                dayDiv.addEventListener('mouseout', () => {
                    tooltip.style.display = 'none';
                });
                
                dayDiv.addEventListener('click', () => {
                    selectedDate = currentDate;
                    noteText.value = notes[dateString] || '';
                    showNoteForm();
                });
                
                daysDiv.appendChild(dayDiv);
            }
            
            monthDiv.appendChild(daysDiv);
            calendarContainer.appendChild(monthDiv);
        }
    }
    
    function showNoteForm() {
        noteForm.style.display = 'block';
    }
    
    function hideNoteForm() {
        noteForm.style.display = 'none';
    }
    
    function saveNote() {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            notes[dateString] = noteText.value;
            localStorage.setItem('notes', JSON.stringify(notes));
            createCalendar(new Date().getFullYear());
            hideNoteForm();
        }
    }
    
    function clearNotes() {
        if (confirm('Tem certeza de que deseja limpar todas as observações?')) {
            localStorage.removeItem('notes');
            Object.keys(notes).forEach(date => delete notes[date]);
            createCalendar(new Date().getFullYear());
        }
    }
    
    // Styling for sidebar and note form
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column'; // Arrange elements vertically
    sidebar.style.alignItems = 'center'; // Center horizontally
    sidebar.style.padding = '20px';
    sidebar.style.borderLeft = '1px solid #ccc';
    sidebar.style.flex = '0 0 300px';
    
    noteForm.style.display = 'none';
    noteForm.style.background = 'white';
    noteForm.style.padding = '20px';
    noteForm.style.border = '1px solid #ccc';
    noteForm.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    noteForm.style.position = 'fixed';
    noteForm.style.top = '50%';
    noteForm.style.left = '0';
    noteForm.style.transform = 'translateY(-50%)';
    
    noteText.style.width = '300px';
    noteText.style.height = '100px';
    
    saveNoteButton.textContent = 'Salvar';
    saveNoteButton.addEventListener('click', saveNote);
    
    cancelNoteButton.textContent = 'Cancelar';
    cancelNoteButton.addEventListener('click', hideNoteForm);
    
    clearNotesButton.textContent = 'Limpar Todas';
    clearNotesButton.addEventListener('click', clearNotes);
    
    noteForm.appendChild(noteText);
    noteForm.appendChild(saveNoteButton);
    noteForm.appendChild(cancelNoteButton);
    
    sidebar.appendChild(noteForm);
    sidebar.appendChild(clearNotesButton); // Add the clear button to the sidebar
    document.body.appendChild(calendarContainer);
    document.body.appendChild(sidebar);
    
    // Tooltip styling
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.fontSize = '0.8em';
    tooltip.style.display = 'none';
    
    document.body.appendChild(tooltip);

    // Styling for holiday days
    const style = document.createElement('style');
    style.textContent = `
        .day.holiday {
            background-color: red;
            color: white;
            font-weight: bold;
        }
        .day {
            padding: 10px;
            text-align: center;
            border: 1px solid #ddd;
            box-sizing: border-box;
        }
        .month {
            margin-bottom: 30px; /* Add space between months */
        }
    `;
    document.head.appendChild(style);

    createCalendar(new Date().getFullYear());
});
